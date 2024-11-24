const express = require('express');
const cors = require('cors');
const notionController = require('./controllers/notionController.js ');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/insertData', notionController.insertData);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
