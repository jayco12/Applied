import os
from flask import Flask, redirect, request, jsonify, session
import requests
import sqlite3

# Initialize Flask app
app = Flask(__name__)

# Set environment variables or define them here
CLIENT_ID = os.getenv("147d872b-594c-80ea-a303-0037e8cb1293")
CLIENT_SECRET = os.getenv("secret_Bqxr484K7npBXijKRaOqZLrZ00FTnhBnRw2cYTaNemG")
REDIRECT_URI = "http://localhost:5000/callback"  # Ensure this matches your Notion OAuth settings
TOKEN_URL = "https://api.notion.com/v1/oauth/token"
AUTH_URL = "https://api.notion.com/v1/oauth/authorize"

# Initialize database
def init_db():
    conn = sqlite3.connect('notion_tokens.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT,
            refresh_token TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Call this function to store tokens in the database
def store_tokens(access_token, refresh_token):
    conn = sqlite3.connect('notion_tokens.db')
    c = conn.cursor()
    c.execute('INSERT INTO tokens (access_token, refresh_token) VALUES (?, ?)', (access_token, refresh_token))
    conn.commit()
    conn.close()

# Route for initiating the OAuth flow
@app.route("/authorize")
def authorize():
    url = f"{AUTH_URL}?client_id=147d872b-594c-80ea-a303-0037e8cb1293&response_type=code&owner=user&redirect_uri={REDIRECT_URI}"
    return redirect(url)

@app.route('/callback')
def callback():
    code = request.args.get('code') 
    if not code:
        return jsonify({"error": "Authorization code not found in request"})

    # Exchange code for an access token
    response = requests.post(
        "https://api.notion.com/v1/oauth/token",
        json={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": "http://localhost:5000/callback",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        },
        headers={"Content-Type": "application/json"}
    )

    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve access token", "details": response.json()})

    token_data = response.json()
    return jsonify(token_data)

# Route to get data from Notion (for example, fetch databases)
@app.route("/notion-data")
def notion_data():
    conn = sqlite3.connect('notion_tokens.db')
    c = conn.cursor()
    c.execute('SELECT * FROM tokens LIMIT 1')
    token_row = c.fetchone()
    conn.close()

    if token_row:
        access_token = token_row[1]  # Access token is in the second column

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Notion-Version": "2024-05-15"  # Use the latest version of the Notion API
        }

        # Example request to fetch a user's Notion database
        notion_api_url = "https://api.notion.com/v1/databases"
        response = requests.get(notion_api_url, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to fetch Notion data"}), 400
    else:
        return jsonify({"error": "No access token found"}), 400

# Initialize the database when the app starts
init_db()

if __name__ == "__main__":
    app.run(debug=True)
