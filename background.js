chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.runtime.openOptionsPage(function () { });
    sendResponse({ result: "success" });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: "https://kym22-web.ofc.kobe-u.ac.jp/campusweb/" });
});