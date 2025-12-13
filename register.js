// register.js — يستخدم api.js و appCore
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const btn = document.getElementById('registerBtn');

    function notify(m,t='info'){ if (window.appCore && appCore.notify) appCore.notify(m,t); else alert(m); }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get('full_name')||'').trim();
        const email = (fd.get('email')||'').trim();
        const password = fd.get('password') || '';
        const confirm = fd.get('confirm_password') || '';
        const country = fd.get('country') || '';
        const agree = fd.get('agree_terms');

        if (name.length < 3) return notify('الاسم يجب أن يحتوي على 3 أحرف على الأقل','error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return notify('البريد غير صحيح','error');
        if (password.length < 6) return notify('كلمة المرور قصيرة','error');
        if (password !== confirm) return notify('كلمات المرور غير متطابقة','error');
        if (!country) return notify('اختر بلدك','error');
        if (!agree) return notify('يجب الموافقة على الشروط','error');

        btn.disabled = true;
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';

        const userObj = {
            name, email, password, country, interests: fd.getAll('interests') || [], newsletter: !!fd.get('newsletter')
        };

        try {
            const res = await api.register(userObj);
            if (!res.success) throw new Error(res.message || 'Registration failed');
            notify('تم إنشاء الحساب بنجاح','success');
            setTimeout(()=> window.location.href = 'login.html', 900);
        } catch(err){
            console.error(err);
            notify(err.message || 'حدث خطأ أثناء التسجيل','error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });
});