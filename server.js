require("dotenv").config();
const express = require("express");
const { Client } = require("@notionhq/client");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Notion page ID where the database will be created
const parentPageId = process.env.NOTION_PAGE_ID;

app.use(bodyParser.json());

let databaseId;

// Function to create a new database
async function createDatabase() {
  try {
    const response = await notion.databases.create({
      parent: { page_id: parentPageId },
      title: [
        {
          type: "text",
          text: { content: "Internship Applications" },
        },
      ],
      properties: {
        "Job Title": { title: {} },
        "Company": { rich_text: {} },
        "Location": { rich_text: {} },
        "Salary": { rich_text: {} },
      },
    });

    databaseId = response.id;
    console.log("Database created with ID:", databaseId);
    return databaseId;
  } catch (error) {
    console.error("Error creating database:", error);
    throw new Error("Failed to create database.");
  }
}

// Endpoint to add job details to the Notion database
app.post("/databases", async (req, res) => {
  const { jobTitle, location, company, salary } = req.body;

  if (!jobTitle || !location || !company || !salary) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if the database exists, if not, create it
    if (!databaseId) {
      await createDatabase();
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Job Title": {
          title: [
            {
              text: {
                content: jobTitle,
              },
            },
          ],
        },
        "Company": {
          rich_text: [
            {
              text: {
                content: company,
              },
            },
          ],
        },
        "Location": {
          rich_text: [
            {
              text: {
                content: location,
              },
            },
          ],
        },
        "Salary": {
          rich_text: [
            {
              text: {
                content: salary,
              },
            },
          ],
        },
      },
    });

    res.status(200).json({ message: "Job added successfully!", data: response });
  } catch (error) {
    console.error("Error adding job to Notion:", error);
    res.status(500).json({ message: "Failed to add job to Notion." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
