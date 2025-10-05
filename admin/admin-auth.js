/**
 * Sistema de Autenticación para Panel de Administración Synapleads
 * Maneja login/logout y control de acceso
 */

class AdminAuth {
    constructor() {
        this.sessionKey = 'synapleads_admin_session';
        this.defaultCredentials = {
            username: 'admin',
            password: 'synapleads2025'
        };
        this.sessionDuration = 8 * 60 * 60 * 1000; // 8 horas
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkSession();
    }
    
    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        // Enter key en campos de login
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
    }
    
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                
                if (sessionData.expires > now) {
                    this.showAdminPanel();
                    return;
                }
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }
        
        this.showLoginModal();
    }
    
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        // Limpiar errores previos
        this.hideError();
        
        // Validación básica
        if (!username || !password) {
            this.showError('Por favor complete todos los campos');
            return;
        }
        
        // Verificar credenciales
        if (this.validateCredentials(username, password)) {
            this.createSession();
            this.showAdminPanel();
            this.trackLogin();
        } else {
            this.showError('Credenciales incorrectas. Verifique usuario y contraseña.');
            this.trackFailedLogin();
        }
    }
    
    validateCredentials(username, password) {
        // Credenciales por defecto
        if (username === this.defaultCredentials.username && 
            password === this.defaultCredentials.password) {
            return true;
        }
        
        // Aquí se pueden agregar más validaciones o integrar con API
        return false;
    }
    
    createSession() {
        const now = new Date().getTime();
        const expires = now + this.sessionDuration;
        
        const sessionData = {
            username: document.getElementById('username').value.trim(),
            loginTime: now,
            expires: expires,
            sessionId: this.generateSessionId()
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }
    
    generateSessionId() {
        return 'admin_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    handleLogout() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            localStorage.removeItem(this.sessionKey);
            this.trackLogout();
            this.showLoginModal();
        }
    }
    
    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
        
        // Focus en el campo username
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);
    }
    
    showAdminPanel() {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        
        // Inicializar el panel si no está inicializado
        if (window.AdminMain && !window.AdminMain.initialized) {
            window.AdminMain.init();
        }
    }
    
    showError(message) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        const errorDiv = document.getElementById('loginError');
        errorDiv.classList.add('hidden');
    }
    
    isAuthenticated() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            return sessionData.expires > now;
        } catch (e) {
            return false;
        }
    }
    
    getCurrentUser() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return null;
        
        try {
            const sessionData = JSON.parse(session);
            return sessionData.username;
        } catch (e) {
            return null;
        }
    }
    
    extendSession() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            if (sessionData.expires > now) {
                sessionData.expires = now + this.sessionDuration;
                localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
                return true;
            }
        } catch (e) {
            console.error('Error extending session:', e);
        }
        
        return false;
    }
    
    // Analytics tracking
    trackLogin() {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'admin_login', {
                    'event_category': 'admin',
                    'event_label': 'successful_login'
                });
            }
        } catch (e) {
            console.log('Analytics tracking not available');
        }
    }
    
    trackFailedLogin() {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'admin_login_failed', {
                    'event_category': 'admin',
                    'event_label': 'failed_login'
                });
            }
        } catch (e) {
            console.log('Analytics tracking not available');
        }
    }
    
    trackLogout() {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'admin_logout', {
                    'event_category': 'admin',
                    'event_label': 'logout'
                });
            }
        } catch (e) {
            console.log('Analytics tracking not available');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.AdminAuth = new AdminAuth();
});

// Auto-extend session en actividad del usuario
document.addEventListener('click', () => {
    if (window.AdminAuth && window.AdminAuth.isAuthenticated()) {
        window.AdminAuth.extendSession();
    }
});

document.addEventListener('keydown', () => {
    if (window.AdminAuth && window.AdminAuth.isAuthenticated()) {
        window.AdminAuth.extendSession();
    }
});