const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;  // Asenkron fs kullanımı
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';
const COMMENTS_FILE = './comments.json';

// Kullanıcıları getir
app.get('/users', async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar alınırken hata oluştu.' });
  }
});

// Yeni kullanıcı kaydı
app.post('/register', async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı kaydederken hata oluştu.' });
  }
});

// Giriş (email & şifre)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Giriş işlemi sırasında hata oluştu.' });
  }
});

// Yorumları getir
app.get('/comments', async (req, res) => {
  try {
    const comments = JSON.parse(await fs.readFile(COMMENTS_FILE, 'utf8'));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Yorumlar alınırken hata oluştu.' });
  }
});

// Yeni yorum ekle
app.post('/comments', async (req, res) => {
  try {
    const comments = JSON.parse(await fs.readFile(COMMENTS_FILE, 'utf8'));
    const { userId, content } = req.body;
    const newComment = {
      id: Date.now(),
      userId: userId,
      content: content,
      timestamp: new Date().toISOString()
    };
    comments.push(newComment);
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Yorum eklerken hata oluştu.' });
  }
});

// Yorum silme
app.delete('/comments/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const comments = JSON.parse(await fs.readFile(COMMENTS_FILE, 'utf8'));
    
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      comments.splice(commentIndex, 1);
      await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
      res.status(200).json({ message: 'Yorum silindi.' });
    } else {
      res.status(404).json({ message: 'Yorum bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Yorum silinirken hata oluştu.' });
  }
});

// Yorum düzenleme
app.put('/comments/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;
    const comments = JSON.parse(await fs.readFile(COMMENTS_FILE, 'utf8'));
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.content = content;
      await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: 'Yorum bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Yorum düzenlenirken hata oluştu.' });
  }
});

// Admin yetkisi
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  // Admin girişi için kontrol
  if (email === "merdem58171.3@gmail.com" && password === "ADMİNHGFD216789ADMİN") {
    res.json({ message: "Admin girişi başarılı" });
  } else {
    res.status(401).json({ message: 'Admin giriş bilgileri hatalı.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
