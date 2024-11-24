// Background script for handling scraping and pushing data to Notion

const geminiApiKey = process.env.GEMINI_API_KEY;
const notionApiKey = process.env.NOTION_KEY;
const notionPageId = process.env.NOTION_PAGE_ID;

// Listener for messages from the popup.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "scrapeAndPush") {
    const url = message.url;
    try {
      const scrapedData = await scrapeData(url);
      const success = await pushToNotion(scrapedData);
      sendResponse({ success: success });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;  // Keep the message channel open for asynchronous response
});

// Function to scrape data from a URL using Gemini API
async function scrapeData(url) {
  const response = await fetch('https://api.geminiscraper.com/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${geminiApiKey}`
    },
    body: JSON.stringify({
      url: url,
      fields: ['title', 'company', 'description']  // Specify the fields you want
    })
  });

  const data = await response.json();
  if (!data) throw new Error("Failed to scrape data from the page");
  
  return {
    title: data.title || "No Title Found",
    company: data.company || "No Company Found",
    description: data.description || "No Description Found"
  };
}

// Function to push scraped data to Notion
async function pushToNotion(data) {
  const notionResponse = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { page_id: notionPageId },
      properties: {
        Name: {
          title: [
            { text: { content: data.title } }
          ]
        }
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              { text: { content: `Company: ${data.company}` } }
            ]
          }
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              { text: { content: `Description: ${data.description}` } }
            ]
          }
        }
      ]
    })
  });

  const result = await notionResponse.json();
  if (!result) throw new Error("Failed to push data to Notion");
  return true;
}
