document.getElementById("extract").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      document.getElementById("output").innerText = "No active tab found.";
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: extractJobDetails,
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError.message);
          document.getElementById("output").innerText = "Error extracting data.";
          return;
        }

        if (results && results[0]?.result) {
          const jobDetails = results[0].result;
          document.getElementById("output").innerText = `
            Job Title: ${jobDetails.jobTitle || "Not found"}
            Salary: ${jobDetails.salary || "Not found"}
            Company: ${jobDetails.company || "Not found"}
            Location: ${jobDetails.location || "Not found"}
          `;
          sendToNotion(jobDetails);
        } else {
          document.getElementById("output").innerText = "Error: No data found.";
        }
      }
    );
  });
});

function extractJobDetails() {
  const selectors = {
    jobTitle: [
      "h1", // Generic heading
      "h2",
      ".job__title h1",
      ".job__header h1",
      "[class*=job-title]",
      "[id*=job-title]",
    ],
    location: [
      ".job__location div",
      "[class*=location]",
      "[id*=location]",
      "meta[name='job-location']", // Meta tag for location
    ],
    company: [
      ".company__name",
      ".job__company",
      "[class*=company]",
      "[id*=company]",
      "meta[name='job-company']", // Meta tag for company
    ],
    salary: [
      ".job__salary",
      "[class*=salary]",
      "[id*=salary]",
      "meta[name='job-salary']", // Meta tag for salary
    ],
  };

  function getElementText(selectors) {
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element.textContent.trim();
    }
    return null;
  }

  function extractSalary() {
    const patterns = /\$\d+(,\d+)?(.\d+)?/g; // Match salary-like patterns
    const allText = document.body.innerText;
    const match = allText.match(patterns);
    return match ? match[0] : "Salary Not Found";
  }

  const jobTitle = getElementText(selectors.jobTitle) || "Job Title Not Found";
  const location = getElementText(selectors.location) || "Location Not Found";
  const company = getElementText(selectors.company) || "Company Not Found";
  const salary = extractSalary();

  return { jobTitle, location, company, salary };
}

  function containsText(element, text) {
    return element.textContent.toLowerCase().includes(text.toLowerCase());
  }
  async function sendToNotion(jobDetails) {
    const notionEndpoint = "http://localhost:3000/databases"; // Replace with your actual Notion API endpoint
  
    try {
      const response = await fetch(notionEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobDetails),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Data successfully sent to Notion:", result);
        document.getElementById("output").innerText += `\nData sent to Notion successfully!`;
      } else {
        console.error("Failed to send data to Notion:", result);
        document.getElementById("output").innerText += `\nFailed to send data to Notion: ${result.message}`;
      }
    } catch (error) {
      console.error("Error sending data to Notion:", error);
      document.getElementById("output").innerText += "\nError sending data to Notion.";
    }
  }