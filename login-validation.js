// Login form validation
function validateLoginForm() {
    const form = document.getElementById('loginForm');
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    const errorContainer = document.getElementById('loginError');
    
    // Clear previous errors
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
    email.classList.remove('error');
    password.classList.remove('error');
    
    // Email validation
    if (!email.value.trim()) {
        showError('البريد الإلكتروني مطلوب', email);
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError('الرجاء إدخال بريد إلكتروني صحيح', email);
        return false;
    }
    
    // Password validation
    if (!password.value) {
        showError('كلمة المرور مطلوبة', password);
        return false;
    }
    
    if (password.value.length < 6) {
        showError('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل', password);
        return false;
    }
    
    return true;
}

function showError(message, element) {
    const errorContainer = document.getElementById('loginError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    if (element) {
        element.classList.add('error');
        element.focus();
    }
    
    // Scroll to error message
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                // If validation passes, submit the form
                this.submit();
            }
        });
    }
});
