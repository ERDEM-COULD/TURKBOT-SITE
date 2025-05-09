// Veri yapıları
let users = JSON.parse(localStorage.getItem('users')) || [];
let sponsors = JSON.parse(localStorage.getItem('sponsors')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM elementleri
const DOM = {
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userGreeting: document.getElementById('user-greeting'),
    loginModal: document.getElementById('login-modal'),
    registerModal: document.getElementById('register-modal'),
    settingsModal: document.getElementById('settings-modal'),
    closeLogin: document.getElementById('close-login'),
    closeRegister: document.getElementById('close-register'),
    closeSettings: document.getElementById('close-settings'),
    confirmLogin: document.getElementById('confirm-login'),
    confirmRegister: document.getElementById('confirm-register'),
    settingsLink: document.getElementById('settings-link'),
    commentForm: document.getElementById('comment-form'),
    commentText: document.getElementById('comment-text'),
    submitComment: document.getElementById('submit-comment'),
    commentsList: document.getElementById('comments-list'),
    sponsorForm: document.getElementById('sponsor-application'),
    submitSponsor: document.getElementById('submit-sponsor'),
    sponsorCompany: document.getElementById('company-name'),
    sponsorMessage: document.getElementById('sponsor-details'),
    sponsorList: document.getElementById('sponsor-list'),
    settingsName: document.getElementById('settings-name'),
    settingsEmail: document.getElementById('settings-email'),
    settingsPassword: document.getElementById('settings-password'),
    saveSettings: document.getElementById('save-settings'),
    deleteAccount: document.getElementById('delete-account'),
    userComments: document.getElementById('user-comments'),
    adminTab: document.getElementById('admin-tab'),
    adminAccounts: document.getElementById('admin-accounts'),
    tabContents: document.querySelectorAll('.tab-content'),
    tabButtons: document.querySelectorAll('.tab-btn')
};

// Verileri başlatma fonksiyonu (initializeData tanımı)
function initializeData() {
    if (sponsors.length === 0) {
        sponsors = [
            {
                id: 1,
                companyName: "ÖRNEK 1",
                ownerName: "ÖRNEK İSİM",
                email: "example.com",
                logo: "https://örnek logo",
                approved: true
            },
            {
                id: 2,
                companyName: "ÖRNEK 1",
                ownerName: "ÖRNEK İSİM",
                email: "example.com",
                logo: "https://örnek logo",
                approved: true
            }
        ];
        localStorage.setItem('sponsors', JSON.stringify(sponsors));
    }

    if (users.length === 0) {
        const adminUser = {
            id: 1,
            name: "ADMİN",
            email: "merdem58171.3@gmail.com",
            password: "ADMİNHGFD216789ADMİN",
            isAdmin: true
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// UI güncelleme fonksiyonu
function updateAuthUI() {
    if (currentUser) {
        if (DOM.loginBtn) DOM.loginBtn.style.display = 'none';
        if (DOM.registerBtn) DOM.registerBtn.style.display = 'none';
        if (DOM.userGreeting) {
            DOM.userGreeting.style.display = 'block';
            DOM.userGreeting.textContent = `Hoş geldiniz, ${currentUser.name}`;
        }
        if (DOM.logoutBtn) DOM.logoutBtn.style.display = 'block';
    } else {
        if (DOM.loginBtn) DOM.loginBtn.style.display = 'block';
        if (DOM.registerBtn) DOM.registerBtn.style.display = 'block';
        if (DOM.userGreeting) DOM.userGreeting.style.display = 'none';
        if (DOM.logoutBtn) DOM.logoutBtn.style.display = 'none';
    }
}

// Diğer fonksiyonlar (loadComments, loadSponsors, setupEventListeners vb.)
// ... [Buraya önceki gönderdiğim diğer tüm fonksiyonlar gelecek]

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Eksik element kontrolü
    if (!DOM.loginBtn || !DOM.registerBtn) {
        console.error("Kritik DOM elementleri eksik!");
        return;
    }

    initializeData(); // Artık tanımlı
    updateAuthUI();
    loadComments();
    loadSponsors();
    setupEventListeners();
    
    if (currentUser?.isAdmin && DOM.adminTab) {
        DOM.adminTab.style.display = 'block';
    }
});
// UI güncelleme fonksiyonu (güvenli hale getirildi)
function updateAuthUI() {
    if (!DOM) return; // DOM yüklenmediyse çık

    try {
        if (currentUser) {
            if (DOM.loginBtn) DOM.loginBtn.style.display = 'none';
            if (DOM.registerBtn) DOM.registerBtn.style.display = 'none';
            if (DOM.userGreeting) {
                DOM.userGreeting.style.display = 'block';
                DOM.userGreeting.textContent = `Hoş geldiniz, ${currentUser.name}`;
            }
            if (DOM.logoutBtn) DOM.logoutBtn.style.display = 'block';
        } else {
            if (DOM.loginBtn) DOM.loginBtn.style.display = 'block';
            if (DOM.registerBtn) DOM.registerBtn.style.display = 'block';
            if (DOM.userGreeting) DOM.userGreeting.style.display = 'none';
            if (DOM.logoutBtn) DOM.logoutBtn.style.display = 'none';
        }
    } catch (error) {
        console.error("UI güncelleme hatası:", error);
    }
}
let comments = []; // Yorumlar burada saklanacak
let displayedComments = 0; // Görüntülenen yorum sayısı

// Yorumları backend'den çekme
function loadComments() {
  fetch('http://localhost:3000/comments')
    .then(response => response.json())
    .then(data => {
      comments = data;
      displayedComments = 0;
      displayComments();
    })
    .catch(error => console.error('Yorumlar yüklenemedi:', error));
}

// Yorumları ekrana basma
function displayComments() {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';

  // İlk 10 yorumu göster
  const commentsToDisplay = comments.slice(0, 10);
  commentsToDisplay.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.textContent = comment.content;
    commentsList.appendChild(commentDiv);
  });

  // Eğer 10'dan fazla yorum varsa, "DAHA FAZLASI" butonunu göster
  if (comments.length > 10) {
    document.getElementById('load-more-btn').style.display = 'inline-block';
  }
}

// "DAHA FAZLASI" butonuna tıklandığında tüm yorumları göster
document.getElementById('load-more-btn').addEventListener('click', function() {
  openCommentsModal();
  displayAllComments();
});

// Tüm yorumları modal penceresinde göster
function displayAllComments() {
  const allCommentsList = document.getElementById('all-comments-list');
  allCommentsList.innerHTML = '';

  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.textContent = comment.content;
    allCommentsList.appendChild(commentDiv);
  });
}

// Yorumlar ekranını açma
function openCommentsModal() {
  document.getElementById('comments-modal').style.display = 'block';
}

// Yorumlar ekranını kapama
document.getElementById('close-modal').addEventListener('click', function() {
  document.getElementById('comments-modal').style.display = 'none';
});

// Yorum ekleme
function submitComment(content) {
  if (!currentUser) {
    alert('Yorum yapabilmek için giriş yapmalısınız!');
    return;
  }

  const newComment = {
    userId: currentUser.id,  // Giriş yapan kullanıcının ID'si
    content: content
  };

  fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  })
    .then(response => response.json())
    .then(comment => {
      console.log('Yorum başarıyla eklendi:', comment);
      loadComments();  // Yorumları tekrar yükle
    })
    .catch(error => console.error('Yorum eklenemedi:', error));
}

// Diğer fonksiyonlar aynı şekilde kalacak...
// (önceki gönderdiğim tüm fonksiyonlar buraya gelecek)
// ...
// Modal işlemleri
function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

// Yorum işlemleri
function loadComments() {
    DOM.commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        DOM.commentsList.innerHTML = '<p class="no-comments">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const user = users.find(u => u.id === comment.userId);
        if (user) {
            const canEdit = currentUser && (currentUser.id === comment.userId || currentUser.isAdmin);
            const commentElement = createCommentElement(comment, user, canEdit);
            DOM.commentsList.appendChild(commentElement);
        }
    });
    setupCommentEvents();
}


function createCommentElement(comment, user, canEdit) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-user">
                <img src="https://via.placeholder.com/40" alt="${user.name}">
                <div class="comment-user-info">
                    <h4>${user.name}</h4>
                    <p>${new Date(comment.date).toLocaleString()}</p>
                </div>
            </div>
            ${canEdit ? `
            <div class="comment-actions">
                <button class="edit-comment" data-id="${comment.id}">Düzenle</button>
                <button class="delete-comment" data-id="${comment.id}">Sil</button>
            </div>` : ''}
        </div>
        <div class="comment-content">${comment.content}</div>
        <div class="comment-edit-form" id="edit-form-${comment.id}">
            <textarea id="edit-text-${comment.id}">${comment.content}</textarea>
            <button class="save-edit" data-id="${comment.id}">Kaydet</button>
            <button class="cancel-edit" data-id="${comment.id}">İptal</button>
        </div>
    `;
    return commentElement;
}

function setupCommentEvents() {
    document.querySelectorAll('.edit-comment').forEach(btn => {
        btn.addEventListener('click', handleEditComment);
    });

    document.querySelectorAll('.delete-comment').forEach(btn => {
        btn.addEventListener('click', handleDeleteComment);
    });

    document.querySelectorAll('.save-edit').forEach(btn => {
        btn.addEventListener('click', handleSaveEdit);
    });

    document.querySelectorAll('.cancel-edit').forEach(btn => {
        btn.addEventListener('click', handleCancelEdit);
    });
}

function handleEditComment(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    document.getElementById(`edit-form-${commentId}`).style.display = 'block';
    e.target.closest('.comment').querySelector('.comment-content').style.display = 'none';
}

function handleDeleteComment(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    if (confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        comments = comments.filter(c => c.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(comments));
        loadComments();
        if (currentUser) {
            loadUserComments();
        }
    }
}

function handleSaveEdit(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    const newText = document.getElementById(`edit-text-${commentId}`).value;
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
        comments[commentIndex].content = newText;
        localStorage.setItem('comments', JSON.stringify(comments));
        loadComments();
        loadUserComments();
    }
}

function handleCancelEdit(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    document.getElementById(`edit-form-${commentId}`).style.display = 'none';
    e.target.closest('.comment').querySelector('.comment-content').style.display = 'block';
}

function submitSponsorApplication() {
    if (!currentUser) {
        alert('Sponsor başvurusu yapabilmek için lütfen giriş yapın!');
        showModal(document.getElementById('login-modal'));
        return;
    }

    const company = document.getElementById('company-name').value.trim();
    const owner = document.getElementById('owner-name').value.trim();
    const email = document.getElementById('sponsor-email').value.trim();
    const message = document.getElementById('sponsor-details').value.trim();

    if (!company || !owner || !email || !message) {
        alert('Lütfen tüm alanları doldurun!');
        return;
    }

    const application = {
        id: Date.now(),
        userId: currentUser.id,
        companyName: company,
        ownerName: owner,
        email: email,
        message: message,
        date: new Date().toISOString()
    };

    sponsors.push(application);
    localStorage.setItem('sponsors', JSON.stringify(sponsors));

    alert('Sponsor başvurunuz başarıyla gönderildi. Teşekkür ederiz!');

    // Formu temizle
    document.getElementById('company-name').value = '';
    document.getElementById('owner-name').value = '';
    document.getElementById('sponsor-email').value = '';
    document.getElementById('sponsor-details').value = '';
}



// Kullanıcı işlemleri
function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideModal(DOM.loginModal);
        updateAuthUI();
        loadComments();
        
        if (user.isAdmin) {
            DOM.adminTab.style.display = 'block';
            loadAdminAccounts();
        }
        return true;
    }
    return false;
}

function registerUser(name, email, password) {
    if (!name || !email || !password) {
        alert('Lütfen tüm alanları doldurun!');
        return false;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Bu email adresi zaten kayıtlı!');
        return false;
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password,
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    hideModal(DOM.registerModal);
    updateAuthUI();
    loadComments();
    return true;
}

function updateUserSettings() {
    if (!currentUser) return;
    
    const name = DOM.settingsName.value.trim();
    const email = DOM.settingsEmail.value.trim();
    const password = DOM.settingsPassword.value.trim();
    
    if (!name || !email) {
        alert('Ad ve email alanları zorunludur!');
        return;
    }
    
    if (users.some(u => u.email === email && u.id !== currentUser.id)) {
        alert('Bu email adresi başka bir kullanıcı tarafından kullanılıyor!');
        return;
    }
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        if (password) {
            users[userIndex].password = password;
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Ayarlar başarıyla kaydedildi!');
        updateAuthUI();
        loadComments();
        loadUserComments();
    }
}

function deleteCurrentUser() {
    if (!currentUser || !confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
        return;
    }
    
    users = users.filter(u => u.id !== currentUser.id);
    comments = comments.filter(c => c.userId !== currentUser.id);
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('comments', JSON.stringify(comments));
    localStorage.removeItem('currentUser');
    
    currentUser = null;
    hideModal(DOM.settingsModal);
    updateAuthUI();
    loadComments();
}

// Kullanıcı yorumlarını yükle
function loadUserComments() {
    if (!currentUser) return;
    
    DOM.userComments.innerHTML = '';
    const userCommentsList = comments.filter(c => c.userId === currentUser.id);
    
    if (userCommentsList.length === 0) {
        DOM.userComments.innerHTML = '<p class="no-comments">Henüz yorum yapmamışsınız.</p>';
        return;
    }
    
    userCommentsList.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'user-comment';
        commentElement.innerHTML = `
            <div class="user-comment-header">
                <span>${new Date(comment.date).toLocaleString()}</span>
                <div class="user-comment-actions">
                    <button class="edit-user-comment" data-id="${comment.id}">Düzenle</button>
                    <button class="delete-user-comment" data-id="${comment.id}">Sil</button>
                </div>
            </div>
            <div class="user-comment-content">${comment.content}</div>
            <div class="user-comment-edit-form" id="user-edit-form-${comment.id}" style="display:none;">
                <textarea id="user-edit-text-${comment.id}">${comment.content}</textarea>
                <button class="save-user-edit" data-id="${comment.id}">Kaydet</button>
                <button class="cancel-user-edit" data-id="${comment.id}">İptal</button>
            </div>
        `;
        DOM.userComments.appendChild(commentElement);
    });

    setupUserCommentEvents();
}

function setupUserCommentEvents() {
    document.querySelectorAll('.edit-user-comment').forEach(btn => {
        btn.addEventListener('click', handleEditUserComment);
    });

    document.querySelectorAll('.delete-user-comment').forEach(btn => {
        btn.addEventListener('click', handleDeleteUserComment);
    });

    document.querySelectorAll('.save-user-edit').forEach(btn => {
        btn.addEventListener('click', handleSaveUserEdit);
    });

    document.querySelectorAll('.cancel-user-edit').forEach(btn => {
        btn.addEventListener('click', handleCancelUserEdit);
    });
}

function handleEditUserComment(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    document.getElementById(`user-edit-form-${commentId}`).style.display = 'block';
    e.target.closest('.user-comment').querySelector('.user-comment-content').style.display = 'none';
}

function handleDeleteUserComment(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    if (confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        comments = comments.filter(c => c.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(comments));
        loadUserComments();
        loadComments();
    }
}

function handleSaveUserEdit(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    const newText = document.getElementById(`user-edit-text-${commentId}`).value;
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
        comments[commentIndex].content = newText;
        localStorage.setItem('comments', JSON.stringify(comments));
        loadUserComments();
        loadComments();
    }
}

function handleCancelUserEdit(e) {
    const commentId = parseInt(e.target.getAttribute('data-id'));
    document.getElementById(`user-edit-form-${commentId}`).style.display = 'none';
    e.target.closest('.user-comment').querySelector('.user-comment-content').style.display = 'block';
}

// Admin işlemleri
function loadAdminAccounts() {
    if (!currentUser?.isAdmin) return;
    
    DOM.adminAccounts.innerHTML = '';
    
    if (users.length === 0) {
        DOM.adminAccounts.innerHTML = '<p class="no-accounts">Henüz kullanıcı bulunmamaktadır.</p>';
        return;
    }
    
    users.forEach(user => {
        const accountElement = document.createElement('div');
        accountElement.className = 'account-card';
        accountElement.innerHTML = `
            <div class="account-info">
                <h4>${user.name}</h4>
                <p>${user.email} ${user.isAdmin ? '(Admin)' : ''}</p>
            </div>
            <div class="account-actions">
                <button class="login-as-user" data-id="${user.id}">Giriş Yap</button>
                ${user.id !== currentUser.id ? 
                `<button class="delete-user" data-id="${user.id}">Sil</button>` : ''}
            </div>
        `;
        DOM.adminAccounts.appendChild(accountElement);
    });

    setupAdminAccountEvents();
}

function setupAdminAccountEvents() {
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', handleDeleteUser);
    });

    document.querySelectorAll('.login-as-user').forEach(btn => {
        btn.addEventListener('click', handleLoginAsUser);
    });
}

function handleDeleteUser(e) {
    const userId = parseInt(e.target.getAttribute('data-id'));
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        users = users.filter(u => u.id !== userId);
        comments = comments.filter(c => c.userId !== userId);
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('comments', JSON.stringify(comments));
        
        if (currentUser.id === userId) {
            localStorage.removeItem('currentUser');
            currentUser = null;
            updateAuthUI();
        }
        
        loadAdminAccounts();
        loadComments();
    }
}

function handleLoginAsUser(e) {
    const userId = parseInt(e.target.getAttribute('data-id'));
    const user = users.find(u => u.id === userId);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideModal(DOM.settingsModal);
        updateAuthUI();
        loadComments();
        alert(`${user.name} olarak giriş yapıldı`);
    }
}

// Tab işlemleri
function setupTabs() {
    DOM.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            DOM.tabButtons.forEach(btn => btn.classList.remove('active'));
            DOM.tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            if (tabId === 'comment-settings') {
                loadUserComments();
            } else if (tabId === 'admin-settings') {
                loadAdminAccounts();
            }
        });
    });
}

// Event listeners
function setupEventListeners() {
    // Modal açma/kapatma
    DOM.loginBtn.addEventListener('click', () => showModal(DOM.loginModal));
    DOM.registerBtn.addEventListener('click', () => showModal(DOM.registerModal));
    DOM.closeLogin.addEventListener('click', () => hideModal(DOM.loginModal));
    DOM.closeRegister.addEventListener('click', () => hideModal(DOM.registerModal));
    DOM.closeSettings.addEventListener('click', () => hideModal(DOM.settingsModal));
    
    // Ayarlar modalı
    DOM.settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            showModal(DOM.loginModal);
            return;
        }
        
        DOM.settingsName.value = currentUser.name;
        DOM.settingsEmail.value = currentUser.email;
        DOM.settingsPassword.value = '';
        
        // Varsayılan olarak hesap ayarlarını göster
        DOM.tabButtons.forEach(btn => btn.classList.remove('active'));
        DOM.tabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('[data-tab="account-settings"]').classList.add('active');
        document.getElementById('account-settings').classList.add('active');
        
        showModal(DOM.settingsModal);
    });
    
    // Giriş/Kayıt formları
    DOM.confirmLogin.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!loginUser(email, password)) {
            alert('Email veya şifre hatalı!');
        }
    });
    
    DOM.confirmRegister.addEventListener('click', () => {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        if (registerUser(name, email, password)) {
            alert('Kayıt başarılı! Hoş geldiniz ' + name);
        }
    });
    
    // Yorum gönderme
    DOM.submitComment.addEventListener('click', () => {
        if (!currentUser) {
            alert('Yorum yapmak için giriş yapmalısınız!');
            showModal(DOM.loginModal);
            return;
        }
        
        const content = DOM.commentText.value.trim();
        if (!content) {
            alert('Lütfen yorumunuzu yazın!');
            return;
        }
        
        const newComment = {
            id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
            userId: currentUser.id,
            content,
            date: new Date().toISOString()
        };
        
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        DOM.commentText.value = '';
        loadComments();
        loadUserComments();
    });
    
    // Sponsor başvurusu
    DOM.submitSponsor.addEventListener('click', submitSponsorApplication);
    
    // Ayarlar kaydetme
    DOM.saveSettings.addEventListener('click', updateUserSettings);
    
    // Hesap silme
    DOM.deleteAccount.addEventListener('click', deleteCurrentUser);
    
    // Tab yapısı
    setupTabs();
    
    // Çıkış yapma
    DOM.logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        loadComments();
        alert('Başarıyla çıkış yapıldı');
    });
    // Yeni kullanıcıları almak için
const users = JSON.parse(fs.readFileSync('./users.json')) || [];

// Yeni yorumları almak için
const comments = JSON.parse(fs.readFileSync('./comments.json')) || [];

// Buradaki işlemlerle ilgili backend'e yönlendirebilirsin.
// Örneğin, kullanıcıyı kaydetmek için backend'e POST isteği gönderebilirsin.

    // Sayfa yenilendiğinde yorumların kaybolmaması için
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('comments', JSON.stringify(comments));
        localStorage.setItem('sponsors', JSON.stringify(sponsors));
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    });
}
