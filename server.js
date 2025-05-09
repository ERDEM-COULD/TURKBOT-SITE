const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Bellekte tutacağımız yorumlar (RAM'de geçici olarak)
let comments = [];
// Statik dosyaları public klasöründen sunuyoruz
app.use(express.static(path.join(__dirname, 'public'))); 
// Yorumları getir
app.get('/comments', (req, res) => {
  res.json(comments); // Bellekteki yorumları döndürüyoruz
});

// Yeni yorum ekle
app.post('/comments', (req, res) => {
  const { userId, content } = req.body;

  // Yeni yorum
  const newComment = {
    id: Date.now(), // Benzersiz bir id için zaman damgası kullanıyoruz
    userId,
    content,
    timestamp: new Date().toISOString(),
  };

  comments.push(newComment); // Yorumları belleğe ekliyoruz
  res.status(201).json(newComment); // Yorumun kendisini geri gönderiyoruz
});

// Ana sayfaya yönlendirme (HTML dosyasını sunma)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
