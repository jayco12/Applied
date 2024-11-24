import requests
import sqlite3
import os

# Use this function to fetch the access token from the database
def get_access_token():
    conn = sqlite3.connect('notion_tokens.db')
    c = conn.cursor()
    c.execute('SELECT * FROM tokens LIMIT 1')
    token_row = c.fetchone()
    conn.close()

    if token_row:
        return token_row[1]  # Access token is in the second column
    else:
        return None

# Use this function to interact with the Notion API (example: add a page to a database)
def add_job_to_notion(job_data):
    access_token = get_access_token()

    if access_token:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Notion-Version": "2024-05-15"  # Make sure you use the correct Notion version
        }

        database_id = os.getenv("1474a62ccba0808b9c89ee3c1d5c3603")  # Set your database ID here
        notion_api_url = f"https://api.notion.com/v1/pages"

        # Example of adding a page to the database (you can customize this as needed)
        payload = {
            "parent": {"database_id": database_id},
            "properties": {
                "Name": {"title": [{"text": {"content": job_data['title']}}]},
                "Company": {"rich_text": [{"text": {"content": job_data['company']}}]},
                "Location": {"rich_text": [{"text": {"content": job_data['location']}}]},
                # Add more properties here based on your database schema
            }
        }

        response = requests.post(notion_api_url, headers=headers, json=payload)

        if response.status_code == 200:
            return {"message": "Job added to Notion successfully"}
        else:
            return {"error": "Failed to add job to Notion", "details": response.json()}
    else:
        return {"error": "Access token not found"}
