// Extracts text content from the page
let pageText = document.body.innerText;

// Send this extracted text to the background script
chrome.runtime.sendMessage({
    action: "sendToNotion",
    text: pageText
});
