// ملف: sard-world.js
class SardWorld {
    constructor() {
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearch();
    }

    setupEventListeners() {
        // فئات المقالات
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleCategoryChange(btn);
            });
        });

        // تفاعل المقالات
        document.addEventListener('click', (e) => {
            if (e.target.closest('.article-btn')) {
                this.handleArticleAction(e.target.closest('.article-btn'));
            }
            
            if (e.target.closest('.world-card')) {
                this.handleArticleClick(e.target.closest('.world-card'));
            }
        });

        // النشرة البريدية
        document.querySelector('.newsletter-btn')?.addEventListener('click', () => {
            this.handleNewsletterSubscription();
        });

        // ترقيم الصفحات
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handlePageChange(btn);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
    }

    handleCategoryChange(button) {
        // إزالة النشط من جميع الأزرار
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // إضافة النشط للزر المحدد
        button.classList.add('active');
        this.currentCategory = button.textContent.trim();
        
        // تصفية المقالات (محاكاة)
        this.filterArticles(this.currentCategory);
    }

    filterArticles(category) {
        const articles = document.querySelectorAll('.world-card');
        
        articles.forEach(article => {
            if (category === 'الكل') {
                article.style.display = 'block';
            } else {
                const articleBadge = article.querySelector('.article-badge').textContent;
                if (articleBadge === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            }
        });

        this.showNotification(`عرض مقالات: ${category}`, 'info');
    }

    handleArticleAction(button) {
        const article = button.closest('.world-card');
        const actionType = button.querySelector('i').className;
        
        if (actionType.includes('heart')) {
            this.handleLike(button);
        } else if (actionType.includes('comment')) {
            this.handleComment(article);
        } else if (actionType.includes('share')) {
            this.handleShare(article);
        }
    }

    handleLike(button) {
        const countSpan = button.querySelector('span') || button;
        let count = parseInt(countSpan.textContent) || 0;
        
        if (button.classList.contains('liked')) {
            count--;
            button.classList.remove('liked');
            button.innerHTML = '<i class="far fa-heart"></i> ' + count;
        } else {
            count++;
            button.classList.add('liked');
            button.innerHTML = '<i class="fas fa-heart"></i> ' + count;
        }
    }

    handleComment(article) {
        this.showNotification('سيتم فتح قسم التعليقات قريباً', 'info');
    }

    handleShare(article) {
        const title = article.querySelector('h3').textContent;
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'اكتشف هذا المقال المميز على منصة سرد',
                url: window.location.href
            });
        } else {
            this.showNotification('تم نسخ رابط المقال', 'success');
        }
    }

    handleArticleClick(article) {
        const title = article.querySelector('h3').textContent;
        this.showNotification(`جاري تحميل: ${title}`, 'info');
        
        // محاكاة تحميل المقال
        setTimeout(() => {
            // هنا سيتم تحميل صفحة المقال التفصيلية
            console.log('تحميل المقال:', title);
        }, 1000);
    }

    handleNewsletterSubscription() {
        const emailInput = document.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // محاكاة الاشتراك
        emailInput.value = '';
        this.showNotification('شكراً لاشتراكك في النشرة البريدية!', 'success');
    }

    handlePageChange(button) {
        if (button.classList.contains('next')) {
            this.currentPage++;
        } else {
            this.currentPage = parseInt(button.textContent);
        }
        
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.showNotification(`الصفحة ${this.currentPage}`, 'info');
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        const articles = document.querySelectorAll('.world-card');
        let found = false;
        
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
                article.style.display = 'block';
                found = true;
            } else {
                article.style.display = 'none';
            }
        });
        
        if (!found) {
            this.showNotification('لم يتم العثور على نتائج', 'info');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    debounce(func, wait) {
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
}

// تهيئة عالم سرد
document.addEventListener('DOMContentLoaded', function() {
    window.sardWorld = new SardWorld();
});