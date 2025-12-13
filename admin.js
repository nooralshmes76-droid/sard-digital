// ملف: admin.js
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStats();
    }

    setupEventListeners() {
        // إغلاق المودالات
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // النقر خارج المودال
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // تسجيل الخروج
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // إرسال النماذج
        document.getElementById('postForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit(e);
        });
    }

    openModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    async loadStats() {
        // محاكاة تحميل الإحصائيات
        try {
            // هنا سيتم جلب البيانات من الباك إند لاحقاً
            console.log('جاري تحميل الإحصائيات...');
        } catch (error) {
            this.showNotification('حدث خطأ في تحميل البيانات', 'error');
        }
    }

    async handlePostSubmit(e) {
        const formData = new FormData(e.target);
        
        // محاكاة الإرسال
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('تم نشر المنشور بنجاح', 'success');
            this.closeAllModals();
            e.target.reset();
            
        } catch (error) {
            this.showNotification('حدث خطأ في النشر', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('sard_admin_token');
            window.location.href = 'index.html';
        }
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
        }, 4000);
        
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
    
    // وظائف عامة للمودالات
    window.openModal = function(modalId) {
        window.adminDashboard.openModal(modalId);
    };
});