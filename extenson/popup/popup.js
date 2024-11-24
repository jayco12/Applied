document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("extract").addEventListener("click", async () => {
    // Query active tab to get the current page URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found.");
        document.getElementById("output").innerText = "No active tab found.";
        return;
      }

      const tab = tabs[0];
      const url = tab.url;

      // Display message that scraping is in progress
      document.getElementById("output").innerText = "Scraping and pushing data to Notion...";

      try {
        // Send URL to background script for scraping
        chrome.runtime.sendMessage({ action: "scrapeAndPush", url: url }, (response) => {
          if (response.success) {
            document.getElementById("output").innerText = "Data scraped and pushed to Notion!";
          } else {
            document.getElementById("output").innerText = "Error: " + response.error;
          }
        });
      } catch (error) {
        document.getElementById("output").innerText = "Error: " + error.message;
      }
    });
  });
});
