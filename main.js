// ملف: script.js - محدث ومحسّن
class SardApp {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.observers = [];
        this.init();
    }

    async init() {
        // تحميل المكونات الأساسية أولاً
        await this.checkAuth();
        this.setupEventListeners();
        
        // تحميل البيانات الأخرى بشكل متوازي
        Promise.all([
            this.loadUserData(),
            this.lazyLoadImages(),
            this.setupServiceWorker()
        ]).catch(console.error);
        
        this.setupNavigation();
    }
    
    // تحميل الصور عند ظهورها في الشاشة
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // تسجيل Service Worker للتخزين المؤقت
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registration successful');
            } catch (error) {
                console.error('ServiceWorker registration failed:', error);
            }
        }
    }

    checkAuth() {
        const userData = localStorage.getItem('sard_user');
        const adminEmail = 'owner@sard.com'; // البريد الإلكتروني للمالك
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isAdmin = this.currentUser.email === adminEmail;
            
            // تحديث واجهة المستخدم بناءً على صلاحيات المستخدم
            this.updateUIForAuth();
            
            // إظهار/إخفاء عناصر الإدارة
            this.toggleAdminElements();
        }
    }

    setupEventListeners() {
        // نشر منشور جديد
        document.getElementById('publishBtn')?.addEventListener('click', () => {
            this.handlePostCreation();
        });

        // البحث
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });

        // التفاعل مع المنشورات
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                this.handleLike(e.target.closest('.like-btn'));
            }
            
            if (e.target.closest('.comment-btn')) {
                this.handleComment(e.target.closest('.comment-btn'));
            }
            
            if (e.target.closest('.enroll-btn')) {
                this.handleCourseEnrollment(e.target.closest('.enroll-btn'));
            }
        });

        // إدارة النماذج
        this.setupForms();
    }

    setupForms() {
        // نموذج تسجيل الدخول
        document.querySelector('.login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        // نموذج التسجيل في الدورة
        document.getElementById('registrationForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCourseRegistration(e.target);
        });

        // نموذج الاتصال
        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContact(e.target);
        });
    }

    setupNavigation() {
        // التنقل بين الصفحات مع تأثيرات سلسة
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // منع التنقل للروابط الخارجية أو الروابط الخاصة
                if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                    return;
                }

                e.preventDefault();
                
                // تأثير انتقال سلس
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });

        // تمييز الصفحة النشطة
        this.highlightActivePage();
    }

    highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && (href.includes(currentPage) || (currentPage === '' && href.includes('index.html')))) {
                link.classList.add('active');
            }
        });
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // محاكاة عملية تسجيل الدخول
            const result = await this.mockLogin(email, password);
            
            if (result.success) {
                this.showNotification('تم تسجيل الدخول بنجاح!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            this.showNotification('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async mockLogin(email, password) {
        // محاكاة اتصال بالخادم
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('sard_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // حفظ بيانات المستخدم
                    const userData = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar
                    };
                    
                    localStorage.setItem('sard_user', JSON.stringify(userData));
                    resolve({ success: true, user: userData });
                } else {
                    resolve({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
                }
            }, 1000);
        });
    }

    handlePostCreation() {
        const postInput = document.getElementById('postInput');
        const content = postInput?.value.trim();

        if (!content) {
            this.showNotification('يرجى كتابة محتوى المنشور', 'warning');
            return;
        }

        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول لنشر المنشورات', 'warning');
            return;
        }

        const newPost = {
            id: Date.now(),
            author: this.currentUser.name,
            authorAvatar: this.currentUser.avatar,
            content: content,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            tags: this.extractTags(content)
        };

        this.addPostToFeed(newPost);
        postInput.value = '';
        this.showNotification('تم نشر المنشور بنجاح!', 'success');
    }

    addPostToFeed(post) {
        const postsFeed = document.getElementById('postsFeed');
        
        if (!postsFeed) return;

        const postElement = this.createPostElement(post);
        postsFeed.insertBefore(postElement, postsFeed.firstChild);
    }

    createPostElement(post) {
        const postDiv = document.createElement('article');
        postDiv.className = 'post card fade-in';
        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">
                        ${post.authorAvatar ? 
                            `<img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="author-info">
                        <h4>${post.author}</h4>
                        <span class="post-time">${this.formatTime(post.timestamp)}</span>
                    </div>
                </div>
                <button class="post-menu">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="post-content">
                <p>${this.formatPostContent(post.content)}</p>
                ${post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="post-engagement">
                <div class="engagement-stats">
                    <span>${post.likes} إعجاب</span>
                    <span>${post.comments.length} تعليق</span>
                </div>
                <div class="engagement-actions">
                    <button class="engage-btn like-btn">
                        <i class="far fa-heart"></i>
                        <span>إعجاب</span>
                    </button>
                    <button class="engage-btn comment-btn">
                        <i class="far fa-comment"></i>
                        <span>تعليق</span>
                    </button>
                    <button class="engage-btn share-btn">
                        <i class="fas fa-share"></i>
                        <span>مشاركة</span>
                    </button>
                </div>
            </div>
        `;

        return postDiv;
    }

    formatPostContent(content) {
        // تحويل الروابط إلى روابط قابلة للنقر
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.replace(urlRegex, url => 
            `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
        );
    }

    extractTags(content) {
        const tagRegex = /#(\w+)/g;
        const tags = [];
        let match;
        
        while ((match = tagRegex.exec(content)) !== null) {
            tags.push(match[0]);
        }
        
        return tags;
    }

    formatTime(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diff = now - postTime;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days < 7) return `منذ ${days} يوم`;
        
        return postTime.toLocaleDateString('ar-SA');
    }

    handleLike(button) {
        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول للإعجاب بالمنشورات', 'warning');
            return;
        }

        const post = button.closest('.post');
        const likeIcon = button.querySelector('i');
        
        // تبديل حالة الإعجاب
        if (likeIcon.classList.contains('far')) {
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
            button.style.color = '#e74c3c';
            this.showNotification('تم الإعجاب بالمنشور', 'success');
        } else {
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
            button.style.color = '';
            this.showNotification('تم إلغاء الإعجاب', 'info');
        }
    }

    handleComment(button) {
        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول لإضافة تعليق', 'warning');
            return;
        }

        const post = button.closest('.post');
        this.showCommentSection(post);
    }

    showCommentSection(post) {
        // إضافة قسم التعليقات إذا لم يكن موجوداً
        let commentsSection = post.querySelector('.comments-section');
        
        if (!commentsSection) {
            commentsSection = document.createElement('div');
            commentsSection.className = 'comments-section';
            commentsSection.innerHTML = `
                <div class="add-comment">
                    <input type="text" class="comment-input" placeholder="اكتب تعليقك...">
                    <button class="comment-submit">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            `;
            
            post.appendChild(commentsSection);
            
            // إعداد حدث الإرسال
            const submitBtn = commentsSection.querySelector('.comment-submit');
            const commentInput = commentsSection.querySelector('.comment-input');
            
            submitBtn.addEventListener('click', () => {
                this.submitComment(commentInput.value, post);
            });
            
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitComment(commentInput.value, post);
                }
            });
        }
        
        // إظهار/إخفاء قسم التعليقات
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }

    submitComment(content, post) {
        if (!content.trim()) return;

        const commentsSection = post.querySelector('.comments-section');
        const comment = {
            author: this.currentUser.name,
            content: content,
            timestamp: new Date().toISOString()
        };

        // إضافة التعليق للعرض
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="author-avatar">
                ${this.currentUser.avatar ? 
                    `<img src="${this.currentUser.avatar}" alt="${this.currentUser.name}">` : 
                    `<i class="fas fa-user"></i>`
                }
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <strong>${this.currentUser.name}</strong>
                    <span>${this.formatTime(comment.timestamp)}</span>
                </div>
                <p>${content}</p>
            </div>
        `;

        commentsSection.insertBefore(commentElement, commentsSection.firstChild);
        
        // مسح حقل الإدخال
        const commentInput = commentsSection.querySelector('.comment-input');
        commentInput.value = '';
        
        this.showNotification('تم إضافة التعليق', 'success');
    }

    handleSearch(query) {
        if (!query.trim()) return;

        // في تطبيق حقيقي، هنا سيتم البحث في الخادم
        this.showNotification(`جاري البحث عن: ${query}`, 'info');
        
        // تخزين استعلام البحث
        localStorage.setItem('sard_search_query', query);
        
        // التوجيه لصفحة النتائج
        setTimeout(() => {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }, 1000);
    }

    handleCourseEnrollment(button) {
        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول للتسجيل في الدورة', 'warning');
            return;
        }

        const courseTitle = button.closest('.course-preview')?.querySelector('h4')?.textContent;
        this.showNotification(`جاري التسجيل في دورة: ${courseTitle}`, 'info');
        
        // محاكاة عملية التسجيل
        setTimeout(() => {
            this.showNotification('تم التسجيل في الدورة بنجاح!', 'success');
            button.textContent = 'مسجل';
            button.disabled = true;
        }, 2000);
    }

    async handleCourseRegistration(form) {
        const formData = new FormData(form);
        const courseId = form.dataset.courseId;

        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول أولاً', 'warning');
            return;
        }

        try {
            // محاكاة إرسال البيانات
            await this.mockSubmitRegistration(formData, courseId);
            this.showNotification('تم إرسال طلب التسجيل بنجاح!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('حدث خطأ أثناء التسجيل', 'error');
        }
    }

    async mockSubmitRegistration(formData, courseId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // حفظ البيانات محلياً (في تطبيق حقيقي، سيتم إرسالها للخادم)
                const registration = {
                    courseId: courseId,
                    user: this.currentUser,
                    formData: Object.fromEntries(formData),
                    timestamp: new Date().toISOString()
                };
                
                const registrations = JSON.parse(localStorage.getItem('sard_registrations') || '[]');
                registrations.push(registration);
                localStorage.setItem('sard_registrations', JSON.stringify(registrations));
                
                resolve(true);
            }, 1500);
        });
    }

    handleContact(form) {
        const formData = new FormData(form);
        
        this.showNotification('شكراً لك! سنقوم بالرد على رسالتك في أقرب وقت.', 'success');
        form.reset();
    }

    updateUIForAuth() {
        if (this.currentUser) {
            // تحديث معلومات المستخدم
            document.querySelectorAll('.user-info h3').forEach(el => {
                el.textContent = this.currentUser.name;
            });
            
            document.querySelectorAll('.login-prompt').forEach(el => {
                el.style.display = 'none';
            });
            
            // إظهار أزرار الإجراءات للمستخدم المسجل
            document.querySelectorAll('.auth-only').forEach(el => {
                el.style.display = 'block';
            });
        }
    }

    toggleAdminElements() {
        const adminElements = document.querySelectorAll('.admin-only');
        
        adminElements.forEach(el => {
            el.style.display = this.isAdmin ? 'block' : 'none';
        });

        // إضافة زر لوحة التحكم إذا كان المستخدم مديراً
        if (this.isAdmin && !document.querySelector('.admin-btn')) {
            this.addAdminButton();
        }
    }

    addAdminButton() {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && !headerActions.querySelector('.admin-btn')) {
            const adminBtn = document.createElement('a');
            adminBtn.href = 'admin-dashboard.html';
            adminBtn.className = 'admin-btn icon-btn';
            adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
            adminBtn.title = 'لوحة التحكم';
            
            headerActions.insertBefore(adminBtn, headerActions.firstChild);
        }
    }

    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // إضافة الأنماط إذا لم تكن موجودة
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    border-right: 4px solid var(--primary-brown);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification.success {
                    border-right-color: var(--success-color);
                }
                .notification.error {
                    border-right-color: var(--error-color);
                }
                .notification.warning {
                    border-right-color: #f39c12;
                }
                .close-notification {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--text-light);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إعداد إغلاق الإشعار
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    loadUserData() {
        // تحميل البيانات الإضافية للمستخدم
        if (this.currentUser) {
            this.loadUserCourses();
            this.loadUserPosts();
        }
    }

    loadUserCourses() {
        // تحميل دورات المستخدم
        // سيتم تنفيذ هذا في التكامل مع الخادم
    }

    loadUserPosts() {
        // تحميل منشورات المستخدم
        // سيتم تنفيذ هذا في التكامل مع الخادم
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.sardApp = new SardApp();
    
    // تحسينات إضافية للصفحة
    document.body.classList.add('loaded');
    
    // إضافة تأثيرات للعناصر عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثيرات
    document.querySelectorAll('.card, .post, .course-card').forEach(el => {
        observer.observe(el);
    });
});

// دوال مساعدة عالمية
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// تأثير الهيدر عند التمرير
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// استدعاء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScrollEffect();
});
