require("dotenv").config();
const express = require("express");
const { Client } = require("@notionhq/client");
const gemini = require("./scraper");  // Importing the scraping logic

const notion = new Client({ auth: process.env.NOTION_KEY });
const app = express();
app.use(express.json());  // For parsing application/json
app.use(express.static("public"));  // Serve static files like index.html

// Route to scrape data from a URL and push to Notion
app.post("/scrape-and-push", async function (request, response) {
  const { url, pageID } = request.body;

  try {
    // Scrape the data using Gemini
    const scrapedData = await gemini.scrape(url);
    const { title, company, description } = scrapedData;

    // Push the scraped data to Notion
    const newBlock = await notion.blocks.children.append({
      block_id: pageID,
      children: [
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `Title: ${title}\nCompany: ${company}\nDescription: ${description}`,
                },
              },
            ],
          },
        },
      ],
    });

    response.json({ message: "success!", data: newBlock });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

// Start the server
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
