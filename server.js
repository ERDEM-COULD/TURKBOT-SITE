const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const COMMENTS_FILE = './comments.json';

// Yorumları getir
app.get('/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
  res.json(comments);
});

// Yeni yorum ekle
app.post('/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));

  const { userId, content } = req.body;
  const newComment = {
    id: Date.now(),
    userId,
    content,
    timestamp: new Date().toISOString(),
  };

  comments.push(newComment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  res.status(201).json(newComment);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
