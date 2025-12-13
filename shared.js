(function () {
    const BODY = document.body;
    const CURRENT_PAGE = BODY.dataset.page || '';

    const NAV_CARDS = [
        { label: 'ساحة النقاش', emoji: '✒', href: 'index.html', target: 'home' },
        { label: 'الدورات', emoji: '📚', href: 'courses.html', target: 'courses' },
        { label: 'عالم سرد', emoji: '🌎', href: 'sard-world.html', target: 'world' },
        { label: 'المكتبة الذكية', emoji: '🤖', href: 'ai-library.html', target: 'ai-library' },
        { label: 'عن سرد', href: 'about-sard.html', target: 'about' },
        { label: 'حسابي', href: 'user-content.html', target: 'account' }
    ];

    function buildHeader() {
        return `
            <div class="header-bar">
                <button class="menu-toggle" type="button" aria-label="فتح القائمة" data-drawer-toggle>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="header-brand-group">
                    <a href="index.html" class="header-logo" aria-label="سرد رقمي">
                        <span class="logo brand-logo book-logo">
                            <img src="sard.png/1.png" alt="شعار سرد رقمي">
                        </span>
                    </a>
                    <div class="header-brand-inline">
                        <span class="site-title">سرد رقمي</span>
                        <span class="site-slogan">رحلة تفاعلية في عالم المعرفة</span>
                    </div>
                </div>
            </div>
        `;
    }

    function buildDrawer() {
        const cardMarkup = NAV_CARDS.map((item) => `
            <a href="${item.href}" class="drawer-card surface-beige" data-nav-target="${item.target}">
                ${item.emoji ? `<span class="drawer-emoji">${item.emoji}</span>` : ''}
                <span class="drawer-text">${item.label}</span>
            </a>
        `).join('');

        return `
            <div class="drawer-overlay" data-drawer-overlay></div>
            <aside class="site-drawer" data-drawer>
                <div class="drawer-header">
                    <div class="drawer-brand">
                        <span class="logo brand-logo book-logo">
                            <img src="sard.png/1.png" alt="شعار سرد رقمي">
                        </span>
                        <div class="drawer-heading">
                            <span class="drawer-name">سرد رقمي</span>
                            <span class="drawer-tagline">رحلة تفاعلية في عالم المعرفة</span>
                        </div>
                    </div>
                    <button class="drawer-close" type="button" aria-label="إغلاق القائمة" data-drawer-close>&times;</button>
                </div>
                <div class="drawer-content">
                    <div class="drawer-left-menu">
                        <a href="user-content.html" class="drawer-menu-item" data-nav-target="account">
                            <i class="fas fa-cog" aria-hidden="true"></i>
                            <span>الإعدادات</span>
                        </a>
                        <a href="login.html" class="drawer-menu-item" data-nav-target="login">
                            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                            <span>تسجيل الدخول</span>
                        </a>
                        <a href="user-content.html#logout" class="drawer-menu-item">
                            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                            <span>تسجيل الخروج</span>
                        </a>
                    </div>
                    <div class="drawer-grid">
                        ${cardMarkup}
                    </div>
                </div>
            </aside>
        `;
    }

    function buildFooter() {
        return `
            <div class="footer-content">
                <div class="footer-section footer-brand">
                    <div class="footer-brand-wrapper">
                        <a href="index.html" class="footer-logo-link">
                            <span class="logo brand-logo book-logo">
                                <img src="sard.png/1.png" alt="شعار سرد رقمي">
                            </span>
                        </a>
                        <div class="footer-brand-text">
                            <span class="footer-site-title">سرد رقمي</span>
                            <span class="footer-site-slogan">رحلة تفاعلية في عالم المعرفة</span>
                        </div>
                    </div>
                </div>

                <div class="footer-section">
                    <h4>روابط سريعة</h4>
                    <a href="about-sard.html">عن سرد</a>
                    <a href="courses.html">الدورات</a>
                    <a href="sard-world.html">عالم سرد</a>
                    <a href="ai-library.html">المكتبة الذكية</a>
                </div>

                <div class="footer-section">
                    <h4>تابعنا</h4>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/in/%D8%B3%D8%B1%D8%AF-%D8%B1%D9%82%D9%85%D9%8A-sard-digital-935a55352?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://www.facebook.com/share/17RCd7zqfV/" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-facebook"></i>
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/sard_digital?igsh=bHhsNHlmY2ExdjVm" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-instagram"></i>
                            <span>Instagram</span>
                        </a>
                        <a href="https://x.com/sard_digital?t=ygUJXHmyUjfC1w80hPI5RA&s=09" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-x-twitter"></i>
                            <span>X (تويتر)</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>جميع الحقوق محفوظة © ٢٠٢٥ سرد رقمي - رحلة تفاعلية في عالم المعرفة</p>
            </div>
        `;
    }

    function renderHeader() {
        const header = document.querySelector('.site-header');
        if (!header) {
            return null;
        }

        header.innerHTML = buildHeader();

        document.querySelectorAll('[data-drawer-overlay], [data-drawer]').forEach((elem) => elem.remove());
        header.insertAdjacentHTML('afterend', buildDrawer());

        return header;
    }

    function renderFooter() {
        const footer = document.querySelector('.site-footer');
        if (!footer) {
            return;
        }
        footer.innerHTML = buildFooter();
    }

    function highlightActiveLinks() {
        document.querySelectorAll('[data-nav-target]').forEach((element) => {
            element.classList.toggle('active', element.dataset.navTarget === CURRENT_PAGE);
        });
    }

    function initDrawer() {
        const drawer = document.querySelector('[data-drawer]');
        const overlay = document.querySelector('[data-drawer-overlay]');
        const openers = document.querySelectorAll('[data-drawer-toggle]');
        const closers = document.querySelectorAll('[data-drawer-close]');

        if (!drawer || !overlay || openers.length === 0) {
            return;
        }

        openers.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));

        const setToggleState = (isOpen) => {
            openers.forEach((btn) => {
                btn.setAttribute('aria-expanded', String(isOpen));
                btn.classList.toggle('is-open', isOpen);
            });
        };

        const openDrawer = () => {
            drawer.classList.add('is-open');
            overlay.classList.add('is-active');
            BODY.classList.add('drawer-open');
            setToggleState(true);
        };

        const closeDrawer = () => {
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-active');
            BODY.classList.remove('drawer-open');
            setToggleState(false);
        };

        openers.forEach((btn) => btn.addEventListener('click', (event) => {
            event.stopPropagation();
            openDrawer();
        }));

        closers.forEach((btn) => btn.addEventListener('click', closeDrawer));
        overlay.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDrawer();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderHeader();
        renderFooter();
        highlightActiveLinks();
        initDrawer();

        // إظهار زر لوحة التحكم فقط لحساب المدير
        try {
            const userRaw = localStorage.getItem('sard_user');
            const adminEmail = 'owner@sard.com';
            if (userRaw) {
                const user = JSON.parse(userRaw);
                const isAdmin = user && (user.email === adminEmail || user.role === 'admin');
                if (isAdmin) {
                    const headerActions = document.querySelector('.header-actions');
                    if (headerActions && !headerActions.querySelector('.admin-btn')) {
                        const adminBtn = document.createElement('a');
                        adminBtn.href = 'admin-dashboard.html';
                        adminBtn.className = 'admin-btn';
                        adminBtn.setAttribute('aria-label', 'لوحة التحكم');
                        adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
                        headerActions.appendChild(adminBtn);
                    }
                }
            }
        } catch (e) {
            console.warn('Auth check failed for admin button:', e);
        }
    });
})();

