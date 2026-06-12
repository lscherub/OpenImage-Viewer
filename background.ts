import { Storage } from "@plasmohq/storage";

const CONTEXT_MENU_ID = "captureRightClickedImg";
const VIEWER_PAGE_PATH = "tabs/ImageViewer.html";
const WELCOME_PAGE_PATH = "tabs/welcome.html";
const VIEWER_PAGE_URL = chrome.runtime.getURL(VIEWER_PAGE_PATH);

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "ico",
  "tif",
  "tiff",
  "apng",
  "jfif",
  "pjpeg",
  "pjp",
  "heic",
  "heif",
];

const pendingImageTabById = new Map<number, string>();

const isViewerPage = (url?: string) => !!url?.startsWith(VIEWER_PAGE_URL);

const buildViewerUrl = (imageUrl: string) =>
  `${VIEWER_PAGE_URL}?url=${encodeURIComponent(imageUrl)}`;

const looksLikeImageUrl = (url?: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:", "file:"].includes(parsed.protocol)) {
      return false;
    }
    const path = parsed.pathname.toLowerCase();
    return IMAGE_EXTENSIONS.some((ext) =>
      path.endsWith(`.${ext}`)
    );
  } catch {
    return false;
  }
};

const maybeRedirectTabToViewer = async (tabId: number, imageUrl: string) => {
  if (!imageUrl || isViewerPage(imageUrl)) {
    return;
  }
  const storage = new Storage({ area: "local" });
  await storage.set("imageUrl", imageUrl);
  await chrome.tabs.update(tabId, {
    url: buildViewerUrl(imageUrl),
  });
};

const ensureContextMenu = async () => {
  // Recreate to avoid duplicate-id errors when service worker restarts.
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Open Image in OpenImage Viewer",
    contexts: ["image"],
  });
};

chrome.runtime.onInstalled.addListener(async (details) => {
  await ensureContextMenu();

  // When the extension is installed, open the welcome page
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: chrome.runtime.getURL(WELCOME_PAGE_PATH),
    });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureContextMenu();
});

// When the context menu item is clicked
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    const imageUrl = info.srcUrl;
    if (!imageUrl) return;
    const storage = new Storage({ area: "local" });
    await storage.set("imageUrl", imageUrl);
    chrome.tabs.create({ url: buildViewerUrl(imageUrl) });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url || isViewerPage(tab.url)) return;

  if (looksLikeImageUrl(tab.url)) {
    await maybeRedirectTabToViewer(tabId, tab.url);
  }
});

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId < 0) return;
    if (details.type !== "main_frame") return;
    if (isViewerPage(details.url)) return;

    const contentTypeHeader =
      details.responseHeaders?.find(
        (h) => h.name.toLowerCase() === "content-type"
      )?.value || "";

    if (contentTypeHeader.toLowerCase().startsWith("image/")) {
      pendingImageTabById.set(details.tabId, details.url);
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["responseHeaders"]
);

chrome.webNavigation.onCommitted.addListener(async ({ tabId, url, frameId }) => {
  if (frameId !== 0) return;
  if (isViewerPage(url)) return;

  const headerDetectedImageUrl = pendingImageTabById.get(tabId);
  if (headerDetectedImageUrl) {
    pendingImageTabById.delete(tabId);
    await maybeRedirectTabToViewer(tabId, headerDetectedImageUrl);
  }
});

// When the content script sends a message
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.name === "openImageInNewTab") {
    const tabId = sender.tab?.id;
    if (!tabId) {
      return;
    }

    const imageUrl = request.body.src;
    if (!imageUrl) {
      return;
    }

    await maybeRedirectTabToViewer(tabId, imageUrl);
  }
});

chrome.runtime.setUninstallURL("https://forms.gle/kf5rLcvEgp7n3aMs6");
