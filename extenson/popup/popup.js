// popup.js
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("extract").addEventListener("click", async () => {
    // Get the active tab and inject the script to scrape the page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found.");
        document.getElementById("output").innerText = "No active tab found.";
        return;
      }

      // Inject script to scrape job details from the page
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractJobDetails,
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message);
            document.getElementById("output").innerText = "Error extracting data.";
            return;
          }

          if (results && results[0].result) {
            const { jobTitle, salary, company } = results[0].result;

            // Display the extracted job details in the popup
            document.getElementById("output").innerHTML = `
              <strong>Job Title:</strong> ${jobTitle} <br>
              <strong>Salary:</strong> ${salary} <br>
              <strong>Company:</strong> ${company}
            `;
            
            // Optionally, send the extracted data to your backend (Notion)
            sendToNotion(jobTitle, salary, company);
          } else {
            document.getElementById("output").innerText = "Error: Could not extract data.";
          }
        }
      );
    });
  });
});

// Function to extract job details from the page
function extractJobDetails() {
  const jobTitleElement = document.querySelector("[data-jobtitle]"); // Modify selector to match the page
  const salaryElement = document.querySelector("[data-salary]"); // Modify selector
  const companyElement = document.querySelector("[data-company]"); // Modify selector

  const jobTitle = jobTitleElement ? jobTitleElement.getAttribute("data-jobtitle") : "Not available";
  const salary = salaryElement ? salaryElement.getAttribute("data-salary") : "Not available";
  const company = companyElement ? companyElement.getAttribute("data-company") : "Not available";

  return { jobTitle, salary, company };
}

// Function to send data to Notion (example)
async function sendToNotion(jobTitle, salary, company) {
  try {
    const res = await fetch("http://localhost:3000/insertData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dbID: "1474a62c-cba0-808b-9c89-ee3c1d5c3603",  // Replace with your Notion database ID
        jobTitle: jobTitle,
        salary: salary,
        company: company,
      }),
    });

    const result = await res.json();
    if (result.message === "Data inserted successfully!") {
      console.log("Data sent to Notion successfully");
    } else {
      console.log("Error sending data to Notion");
    }
  } catch (error) {
    console.error("Error sending data to Notion:", error);
  }
}
