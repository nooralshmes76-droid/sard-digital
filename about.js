// ملف: about.js
class AboutSard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // نموذج الاتصال
        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            this.handleContactSubmit(e);
        });
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('شكراً لك! تم إرسال رسالتك بنجاح وسنقوم بالرد قريباً.', 'success');
            e.target.reset();
            
        } catch (error) {
            this.showNotification('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
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
        }, 5000);
        
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.aboutSard = new AboutSard();
});