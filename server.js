const express = require('express');
const path = require('path'); // path modülünü buraya ekliyoruz
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// public klasörünü statik dosya olarak sunmak
app.use(express.static(path.join(__dirname, 'public')));

let comments = [];  // Yorumlar bellek üzerinde tutulacak

// Yorumları getir
app.get('/comments', (req, res) => {
  res.json(comments);  // Yorumları RAM'den alıp gönderiyoruz
});

// Yeni yorum ekle
app.post('/comments', (req, res) => {
  const { userId, content } = req.body;

  const newComment = {
    id: Date.now(),
    userId,
    content,
    timestamp: new Date().toISOString(),
  };

  comments.push(newComment);  // Yorum RAM'e ekleniyor
  res.status(201).json(newComment);  // Yeni yorumu geri gönderiyoruz
});

// Ana sayfa ve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
