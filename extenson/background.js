chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

// Send the extracted content to the Flask backend
function sendDataToBackend(data) {
    fetch('http://localhost:5000/process-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: data })
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
}

// Listen for the content extraction trigger
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "sendToNotion") {
        sendDataToBackend(request.text);
    }
});
