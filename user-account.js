// ملف: register.js
class RegisterForm {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                this.handleRegister(e);
            });
        }

        // التحقق من كلمة المرور في الوقت الحقيقي
        const passwordInput = document.querySelector('input[name="password"]');
        const confirmInput = document.querySelector('input[name="confirm_password"]');
        
        if (passwordInput && confirmInput) {
            confirmInput.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    }

    validatePasswordMatch() {
        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
        const confirmInput = document.querySelector('input[name="confirm_password"]');
        
        if (confirmPassword && password !== confirmPassword) {
            confirmInput.style.borderColor = 'var(--error-color)';
            this.showFieldError('كلمات المرور غير متطابقة');
        } else {
            confirmInput.style.borderColor = 'var(--border-color)';
            this.hideFieldError();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // التحقق من البيانات
        if (!this.validateForm(formData)) {
            return;
        }

        const submitBtn = document.getElementById('registerBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;

        try {
            // محاكاة إنشاء الحساب
            await this.createAccount(formData);
            
            this.showNotification('تم إنشاء حسابك بنجاح! جاري توجيهك...', 'success');
            
            // توجيه إلى صفحة الرئيسية بعد ثانيتين
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification('حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(formData) {
        const fullName = formData.get('full_name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const country = formData.get('country');
        const agreeTerms = formData.get('agree_terms');

        // التحقق من الاسم
        if (fullName.length < 3) {
            this.showNotification('الاسم يجب أن يحتوي على 3 أحرف على الأقل', 'error');
            return false;
        }

        // التحقق من البريد الإلكتروني
        if (!this.validateEmail(email)) {
            this.showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error');
            return false;
        }

        // التحقق من كلمة المرور
        if (password.length < 6) {
            this.showNotification('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل', 'error');
            return false;
        }

        // التحقق من تطابق كلمات المرور
        if (password !== confirmPassword) {
            this.showNotification('كلمات المرور غير متطابقة', 'error');
            return false;
        }

        // التحقق من البلد
        if (!country) {
            this.showNotification('الرجاء اختيار البلد', 'error');
            return false;
        }

        // التحقق من الموافقة على الشروط
        if (!agreeTerms) {
            this.showNotification('يجب الموافقة على شروط الخدمة وسياسة الخصوصية', 'error');
            return false;
        }

        return true;
    }

    async createAccount(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // حفظ بيانات المستخدم في localStorage (محاكاة)
                    const userData = {
                        id: Date.now(),
                        name: formData.get('full_name'),
                        email: formData.get('email'),
                        country: formData.get('country'),
                        interests: formData.getAll('interests'),
                        newsletter: formData.get('newsletter') === 'on',
                        created_at: new Date(),
                        avatar: 'https://via.placeholder.com/80/8B4513/FFFFFF?text=' + formData.get('full_name').charAt(0)
                    };
                    
                    localStorage.setItem('sard_user', JSON.stringify(userData));
                    localStorage.setItem('sard_user_token', 'mock_token_' + Date.now());
                    
                    resolve(userData);
                } catch (error) {
                    reject(error);
                }
            }, 2000);
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFieldError(message) {
        // إظهار خطأ تحت حقل التأكيد
        let errorElement = document.querySelector('.password-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'password-error';
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.5rem';
            document.querySelector('input[name="confirm_password"]').parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    hideFieldError() {
        const errorElement = document.querySelector('.password-error');
        if (errorElement) {
            errorElement.remove();
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
    window.registerForm = new RegisterForm();
});