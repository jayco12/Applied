document.getElementById('startTracking').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startTracking' });
});

document.getElementById('stopTracking').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stopTracking' });
});
