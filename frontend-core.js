// ملف: frontend-core.js - نظام أساسي محسّن للواجهة الأمامية
(function(window, document){
    'use strict';

    // ===== NOTIFICATION SYSTEM =====
    class Notify {
        constructor(){ 
            this.container = null;
            this.notifications = [];
        }
        
        createEl(message, type='info'){
            const el = document.createElement('div');
            el.className = `notification ${type}`;
            el.setAttribute('role', 'alert');
            el.setAttribute('aria-live', 'polite');
            el.innerHTML = `
                <div class="msg">${message}</div>
                <button class="close" aria-label="اغلاق الإشعار">&times;</button>
            `;
            el.querySelector('.close').addEventListener('click', ()=> {
                el.classList.remove('show');
                setTimeout(() => el.remove(), 300);
            });
            return el;
        }
        
        show(message, type='info', timeout=4200){
            const el = this.createEl(message, type);
            document.body.appendChild(el);
            
            // Trigger animation
            requestAnimationFrame(() => {
                el.classList.add('show');
            });
            
            if (timeout > 0) {
                setTimeout(() => {
                    el.classList.remove('show');
                    setTimeout(() => el.remove(), 300);
                }, timeout);
            }
            
            this.notifications.push(el);
            return el;
        }
        
        clear(){
            this.notifications.forEach(n => n.remove());
            this.notifications = [];
        }
    }

    // ===== MODAL SYSTEM =====
    class Modal {
        constructor(){ 
            this.stack = [];
        }
        
        open({title='', content='', size='medium'}) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.setAttribute('role', 'dialog');
            backdrop.setAttribute('aria-modal', 'true');
            
            const modal = document.createElement('div');
            modal.className = `modal modal-${size}`;
            modal.innerHTML = `
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close" aria-label="اغلاق النافذة">×</button>
                </div>
                <div class="modal-body"></div>
            `;
            
            const body = modal.querySelector('.modal-body');
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }
            
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
            document.body.style.overflow = 'hidden';
            
            // Close handlers
            modal.querySelector('.close').addEventListener('click', () => this.close(backdrop));
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.close(backdrop);
            });
            
            // Keyboard handler
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.close(backdrop);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
            
            this.stack.push(backdrop);
            return backdrop;
        }
        
        close(backdrop){
            try {
                backdrop.style.opacity = '0';
                setTimeout(() => {
                    backdrop.remove();
                    const idx = this.stack.indexOf(backdrop);
                    if (idx > -1) this.stack.splice(idx, 1);
                    if (this.stack.length === 0) document.body.style.overflow = 'auto';
                }, 300);
            } catch(e) {
                console.error('Error closing modal:', e);
            }
        }
        
        closeAll(){
            this.stack.forEach(b => {
                b.style.opacity = '0';
                setTimeout(() => b.remove(), 300);
            });
            this.stack = [];
            document.body.style.overflow = 'auto';
        }
    }

    // ===== AUTHENTICATION SYSTEM =====
    class Auth {
        constructor(){ 
            this.userKey = 'sard_user';
            this.tokenKey = 'sard_user_token';
            this.adminEmail = process.env.ADMIN_EMAIL || 'owner@sard.com';
        }
        
        current(){
            try {
                return JSON.parse(localStorage.getItem(this.userKey) || 'null');
            } catch(e) {
                return null;
            }
        }
        
        isLoggedIn(){
            return this.current() !== null && this.getToken() !== null;
        }
        
        isAdmin(){
            const u = this.current();
            return u && (u.email === this.adminEmail || u.role === 'admin');
        }
        
        getToken(){
            return localStorage.getItem(this.tokenKey);
        }
        
        setSession(user, token){
            const safe = Object.assign({}, user);
            delete safe.password;
            localStorage.setItem(this.userKey, JSON.stringify(safe));
            if (token) localStorage.setItem(this.tokenKey, token);
        }
        
        logout(){
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.tokenKey);
            window.location.href = 'index.html';
        }
    }

    // ===== NAVIGATION SYSTEM =====
    class Nav {
        constructor(){ 
            this.init();
        }
        
        init(){
            this.attachListeners();
            this.highlight();
        }
        
        attachListeners(){
            document.addEventListener('click', (e) => {
                const link = e.target.closest('.nav-link, .sidebar-link');
                if (!link) return;
                
                const href = link.getAttribute('href') || '';
                if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
                if (e.metaKey || e.ctrlKey || e.which === 2) return;
                
                e.preventDefault();
                this.navigate(href);
            });
        }
        
        navigate(href){
            document.body.style.transition = 'opacity 0.28s ease-in-out';
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        }
        
        highlight(){
            const current = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href') || '';
                if (href.includes(current) || (current === '' && href.includes('index.html'))) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ===== UTILITIES =====
    const utils = {
        save: (k, v) => {
            try {
                localStorage.setItem(k, JSON.stringify(v));
            } catch(e) {
                console.error('Storage error:', e);
            }
        },
        load: (k) => {
            try {
                return JSON.parse(localStorage.getItem(k));
            } catch(e) {
                return null;
            }
        },
        remove: (k) => localStorage.removeItem(k),
        
        // Debounce function
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        // Format date
        formatDate: (date) => {
            const d = new Date(date);
            const now = new Date();
            const diff = now - d;
            
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            if (minutes < 1) return 'الآن';
            if (minutes < 60) return `منذ ${minutes} دقيقة`;
            if (hours < 24) return `منذ ${hours} ساعة`;
            if (days < 7) return `منذ ${days} يوم`;
            
            return d.toLocaleDateString('ar-SA');
        }
    };

    // ===== MAIN APP CORE =====
    const appCore = {
        _notify: new Notify(),
        notify: (msg, type='info', t=4200) => appCore._notify.show(msg, type, t),
        modal: new Modal(),
        auth: new Auth(),
        nav: new Nav(),
        utils: utils,
        
        initUI: function(){
            // Show/hide admin-only elements
            document.querySelectorAll('[data-admin-only]').forEach(el => {
                el.style.display = appCore.auth.isAdmin() ? '' : 'none';
            });
            
            // Update user info
            const user = appCore.auth.current();
            if (user) {
                document.querySelectorAll('.user-name').forEach(n => n.textContent = user.name || 'عضو');
                document.querySelectorAll('.login-prompt').forEach(e => e.style.display = 'none');
                document.querySelectorAll('.user-avatar').forEach(img => {
                    if (img.tagName === 'IMG') {
                        img.src = user.avatar || 'assets/images/avatar-placeholder.png';
                    }
                });
            } else {
                document.querySelectorAll('.login-prompt').forEach(e => e.style.display = '');
            }
            
            // Logout handlers
            document.addEventListener('click', (e) => {
                if (e.target.closest('[data-logout]')) {
                    e.preventDefault();
                    appCore.auth.logout();
                }
            });
        },
        
        ready: function(callback){
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        }
    };

    // ===== EXPOSE TO WINDOW =====
    window.appCore = appCore;

})(window, document);
