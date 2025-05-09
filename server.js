const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';
const COMMENTS_FILE = './comments.json';

// Kullanıcıları getir
app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(users);
});

// Yeni kullanıcı kaydı
app.post('/register', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(201).json(newUser);
});

// Giriş (email & şifre)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
  }
});

// Yorumları getir
app.get('/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
  res.json(comments);
});

// Yeni yorum ekle
app.post('/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
  
  // Kullanıcıdan gelen yorum
  const { userId, content } = req.body;
  const newComment = {
    id: Date.now(),
    userId: userId,  // Yorum yapan kullanıcının ID'si
    content: content,
    timestamp: new Date().toISOString()
  };

  comments.push(newComment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  res.status(201).json(newComment);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});