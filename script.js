// ملف: script.js - سكريبت الصفحة الرئيسية محسّن

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ===== HELPER FUNCTIONS =====
    const notify = (msg, type = 'info') => {
        if (window.appCore && appCore.notify) {
            appCore.notify(msg, type);
        } else {
            alert(msg);
        }
    };

    // ===== HIGHLIGHT ACTIVE LINKS =====
    const highlightActiveLinks = () => {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href') || '';
            const isActive = href.endsWith(current) || 
                           (current === '' && href.endsWith('index.html')) ||
                           (current === 'index.html' && href === 'index.html');
            
            if (isActive) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    };
    highlightActiveLinks();

    // ===== PUBLISH POST HANDLER =====
    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', async () => {
            const input = document.getElementById('postInput');
            const content = input?.value?.trim() || '';

            // Validation
            if (!content) {
                notify('اكتب شيئاً قبل النشر', 'warning');
                return;
            }

            if (content.length < 10) {
                notify('المنشور يجب أن يكون 10 أحرف على الأقل', 'warning');
                return;
            }

            // Check authentication
            const user = api.getCurrentUser();
            if (!user) {
                notify('يجب تسجيل الدخول لنشر منشور', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            // Disable button during submission
            publishBtn.disabled = true;
            publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';

            try {
                const post = {
                    author: user.name,
                    content: content,
                    tags: [],
                    avatar: user.avatar || ''
                };

                const res = await api.createPost(post);

                if (res.success) {
                    notify('تم نشر المنشور بنجاح', 'success');
                    input.value = '';

                    // Add post to feed immediately
                    if (res.data) {
                        const feed = document.getElementById('postsFeed');
                        if (feed) {
                            const html = `
                                <article class="post card" role="article">
                                    <div class="post-header row">
                                        <div class="post-author row">
                                            <img src="${res.data.avatar || 'sard.png/1.png'}" 
                                                 class="author-avatar" 
                                                 alt="${res.data.author}"
                                                 style="width:44px;height:44px;border-radius:8px;object-fit:cover"
                                                 onerror="this.src='sard.png/1.png'" />
                                            <div class="author-info">
                                                <h4>${res.data.author}</h4>
                                                <span class="post-time">الآن</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="post-content mt-1">
                                        <p>${res.data.content}</p>
                                    </div>
                                    <div class="post-engagement row mt-2">
                                        <div class="engagement-stats">
                                            <span>0 إعجاب</span>
                                            <span>0 تعليق</span>
                                        </div>
                                        <div class="engagement-actions row">
                                            <button class="engage-btn like-btn btn ghost" aria-label="إعجاب">
                                                <i class="far fa-heart"></i>
                                                <span>إعجاب</span>
                                            </button>
                                            <button class="engage-btn comment-btn btn ghost" aria-label="تعليق">
                                                <i class="far fa-comment"></i>
                                                <span>تعليق</span>
                                            </button>
                                            <button class="engage-btn share-btn btn ghost" aria-label="مشاركة">
                                                <i class="fas fa-share"></i>
                                                <span>مشاركة</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            `;
                            feed.insertAdjacentHTML('afterbegin', html);
                        }
                    }

                    // Reload posts if function exists
                    if (window.sardApp && typeof window.sardApp.renderPosts === 'function') {
                        window.sardApp.renderPosts();
                    }
                } else {
                    notify(res.message || 'فشل نشر المنشور', 'error');
                }
            } catch (error) {
                console.error('Error publishing post:', error);
                notify('حدث خطأ أثناء نشر المنشور', 'error');
            } finally {
                publishBtn.disabled = false;
                publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر';
            }
        });
    }

    // ===== LOGIN FORM HANDLER =====
    const loginForm = document.querySelector('form.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const email = emailInput?.value?.trim() || '';
            const password = passwordInput?.value || '';

            // Validation
            if (!email || !password) {
                notify('الرجاء ملء جميع الحقول', 'warning');
                return;
            }

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';

            try {
                const res = await api.login(email, password);

                if (res.success) {
                    notify('تم تسجيل الدخول بنجاح', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else {
                    notify(res.message || 'خطأ في تسجيل الدخول', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                notify('حدث خطأ أثناء تسجيل الدخول', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'تسجيل الدخول';
            }
        });
    }

    // ===== REGISTER FORM HANDLER =====
    const registerForm = document.querySelector('form.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = registerForm.querySelector('input[name="name"]');
            const emailInput = registerForm.querySelector('input[type="email"]');
            const passwordInput = registerForm.querySelector('input[type="password"]');
            const confirmInput = registerForm.querySelector('input[name="confirm_password"]');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const name = nameInput?.value?.trim() || '';
            const email = emailInput?.value?.trim() || '';
            const password = passwordInput?.value || '';
            const confirm = confirmInput?.value || '';

            // Validation
            if (!name || !email || !password || !confirm) {
                notify('الرجاء ملء جميع الحقول', 'warning');
                return;
            }

            if (password !== confirm) {
                notify('كلمات المرور غير متطابقة', 'warning');
                return;
            }

            if (password.length < 6) {
                notify('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'warning');
                return;
            }

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';

            try {
                const res = await api.register({
                    name: name,
                    email: email,
                    password: password
                });

                if (res.success) {
                    notify('تم إنشاء الحساب بنجاح', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else {
                    notify(res.message || 'فشل إنشاء الحساب', 'error');
                }
            } catch (error) {
                console.error('Register error:', error);
                notify('حدث خطأ أثناء إنشاء الحساب', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'إنشاء الحساب';
            }
        });
    }

    // ===== LIKE BUTTON HANDLER =====
    document.addEventListener('click', (e) => {
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
                btn.classList.add('liked');
                notify('تم الإعجاب', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                btn.classList.remove('liked');
                notify('تم إلغاء الإعجاب', 'info');
            }
        }
    });

    // ===== SEARCH HANDLER =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debounceSearch = appCore?.utils?.debounce((e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                console.log('Searching for:', query);
                // Implement search functionality here
            }
        }, 300);

        searchInput.addEventListener('input', debounceSearch);
    }

    // ===== INITIALIZE APP CORE =====
    if (window.appCore) {
        appCore.initUI();
    }
});
