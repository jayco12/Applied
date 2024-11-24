const fetch = require("node-fetch");  // Ensure fetch is available in Node.js

// Scrape data from the given URL using Gemini API
const scrape = async (url) => {
  try {
    const response = await fetch(`https://api.geminiscraper.com/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,  // Use your Gemini API key
      },
      body: JSON.stringify({
        url: url,  // The URL you want to scrape
        fields: ['title', 'company', 'description']  // Specify the fields you want to scrape
      })
    });

    const data = await response.json();
    return data;  // Assume this returns scraped content like { title, company, description }
  } catch (error) {
    console.error('Error scraping data:', error);
    return null;
  }
};

module.exports = { scrape };  // Export the function to use in app.js
