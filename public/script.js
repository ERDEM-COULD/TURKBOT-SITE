let users = JSON.parse(localStorage.getItem('users')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || [];
let sponsors = JSON.parse(localStorage.getItem('sponsors')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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

document.addEventListener('DOMContentLoaded', function () {
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

    // Sponsor başvurusu
    function submitSponsorApplication() {
        if (!currentUser) {
            alert('Sponsor başvurusu yapabilmek için lütfen giriş yapın!');
            showModal(DOM.loginModal);
            return;
        }

        const company = DOM.sponsorCompany.value.trim();
        const message = DOM.sponsorMessage.value.trim();

        if (!company || !message) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        const application = {
            id: sponsors.length > 0 ? Math.max(...sponsors.map(s => s.id)) + 1 : 1,
            userId: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            password: currentUser.password,
            company,
            message,
            date: new Date().toISOString()
        };

        sponsors.push(application);
        localStorage.setItem('sponsors', JSON.stringify(sponsors));

        alert('Sponsor başvurunuz başarıyla gönderildi. Teşekkür ederiz!');
        DOM.sponsorCompany.value = '';
        DOM.sponsorMessage.value = '';
    }

    // Event bağla
    DOM.submitSponsor.addEventListener('click', submitSponsorApplication);

    // Sayfa kapanmadan önce localStorage'ı güncelle
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('comments', JSON.stringify(comments));
        localStorage.setItem('sponsors', JSON.stringify(sponsors));
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    });

    // Buradan diğer event'lere, kullanıcı yönetimine, yorum sistemine geçeceğiz...
    function loadUserComments() {
        if (!currentUser) return;
        DOM.userComments.innerHTML = comments
            .filter(c => c.userId === currentUser.id)
            .map(c => `<div class="comment"><strong>${c.user}</strong>: ${c.content}</div>`)
            .join('');
    }

    function loadComments() {
        DOM.commentsList.innerHTML = comments.map(c => `
            <div class="comment">
                <strong>${c.user}</strong>: <span class="comment-content">${c.content}</span>
            </div>
        `).join('');
    }

    function showModal(modal) {
        modal.style.display = 'block';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    function handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Hoş geldiniz, ${user.name}!`);
            hideModal(DOM.loginModal);
            updateUI();
        } else {
            alert('Geçersiz e-posta veya şifre!');
        }
    }

    function handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (users.some(u => u.email === email)) {
            alert('Bu e-posta ile zaten kayıt olunmuş.');
            return;
        }

        const newUser = {
            id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name, email, password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        hideModal(DOM.registerModal);
    }

    function updateUI() {
        if (currentUser) {
            DOM.userGreeting.innerText = `Merhaba, ${currentUser.name}`;
            DOM.loginBtn.style.display = 'none';
            DOM.registerBtn.style.display = 'none';
            DOM.logoutBtn.style.display = 'inline';
            DOM.settingsLink.style.display = 'inline';
        } else {
            DOM.userGreeting.innerText = '';
            DOM.loginBtn.style.display = 'inline';
            DOM.registerBtn.style.display = 'inline';
            DOM.logoutBtn.style.display = 'none';
            DOM.settingsLink.style.display = 'none';
        }

        loadComments();
        loadUserComments();
    }

    DOM.confirmLogin.addEventListener('click', handleLogin);
    DOM.confirmRegister.addEventListener('click', handleRegister);
    DOM.logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUI();
    });

    DOM.loginBtn.addEventListener('click', () => showModal(DOM.loginModal));
    DOM.registerBtn.addEventListener('click', () => showModal(DOM.registerModal));
    DOM.closeLogin.addEventListener('click', () => hideModal(DOM.loginModal));
    DOM.closeRegister.addEventListener('click', () => hideModal(DOM.registerModal));
    DOM.closeSettings.addEventListener('click', () => hideModal(DOM.settingsModal));
    DOM.settingsLink.addEventListener('click', () => {
        if (currentUser) {
            DOM.settingsName.value = currentUser.name;
            DOM.settingsEmail.value = currentUser.email;
            DOM.settingsPassword.value = currentUser.password;
            showModal(DOM.settingsModal);
        }
    });

    DOM.saveSettings.addEventListener('click', () => {
        if (!currentUser) return;
        currentUser.name = DOM.settingsName.value;
        currentUser.email = DOM.settingsEmail.value;
        currentUser.password = DOM.settingsPassword.value;

        const idx = users.findIndex(u => u.id === currentUser.id);
        if (idx !== -1) users[idx] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Ayarlar kaydedildi.');
        updateUI();
        hideModal(DOM.settingsModal);
    });

    DOM.deleteAccount.addEventListener('click', () => {
        if (!currentUser) return;
        users = users.filter(u => u.id !== currentUser.id);
        comments = comments.filter(c => c.userId !== currentUser.id);
        sponsors = sponsors.filter(s => s.userId !== currentUser.id);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('comments', JSON.stringify(comments));
        localStorage.setItem('sponsors', JSON.stringify(sponsors));
        currentUser = null;
        localStorage.removeItem('currentUser');
        alert('Hesabınız silindi.');
        updateUI();
        hideModal(DOM.settingsModal);
    });

    DOM.submitComment.addEventListener('click', () => {
        if (!currentUser) {
            alert('Yorum yapmak için giriş yapmalısınız!');
            showModal(DOM.loginModal);
            return;
        }

        const content = DOM.commentText.value.trim();
        if (!content) {
            alert('Yorum boş olamaz.');
            return;
        }

        const newComment = {
            id: comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1,
            userId: currentUser.id,
            user: currentUser.name,
            content
        };

        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        DOM.commentText.value = '';
        loadComments();
        loadUserComments();
    });

    updateUI();
});
