/**
 * نظام إدارة الدورات والورشات التدريبية
 * Courses Management System
 */

// ============================================
// بيانات الدورات
// ============================================

const coursesData = [
    {
        id: 1,
        title: "فن الكتابة الإبداعية للمحتوى الرقمي",
        description: "تدريب متقدم يركز على صياغة المحتوى الجذاب لمنصات التواصل والمدونات.",
        image: "sard.png/1.png",
        price: 199,
        originalPrice: 399,
        type: "online",
        level: "beginner",
        duration: "12 ساعة",
        students: 1247,
        rating: 4.8,
        reviews: 245,
        instructor: "ندى الصاوي",
        category: "الكتابة الإبداعية",
        featured: true,
        content: "محتوى شامل يغطي أساسيات الكتابة الإبداعية وتقنيات صياغة المحتوى الجذاب.",
        modules: 8,
        certificate: true
    },
    {
        id: 2,
        title: "الإلقاء والخطابة الفعّالة",
        description: "تعلم فنون الإلقاء والخطابة لتأثير أكبر على جمهورك.",
        image: "sard.png/2.png",
        price: 149,
        originalPrice: 299,
        type: "offline",
        level: "intermediate",
        duration: "10 ساعات",
        students: 856,
        rating: 4.7,
        reviews: 189,
        instructor: "أحمد المنصوري",
        category: "الإلقاء والخطابة",
        featured: false,
        content: "دورة عملية تركز على تطوير مهارات الإلقاء والخطابة الفعّالة.",
        modules: 6,
        certificate: true
    },
    {
        id: 3,
        title: "أساسيات الكتابة الأكاديمية",
        description: "تعلم كيفية كتابة الأبحاث والمقالات الأكاديمية بشكل احترافي.",
        image: "sard.png/1.png",
        price: 0,
        originalPrice: 0,
        type: "online",
        level: "beginner",
        duration: "8 ساعات",
        students: 2103,
        rating: 4.6,
        reviews: 412,
        instructor: "د. فاطمة الشامسي",
        category: "الكتابة الأكاديمية",
        featured: false,
        content: "دورة مجانية شاملة عن أساسيات الكتابة الأكاديمية والبحثية.",
        modules: 5,
        certificate: true
    },
    {
        id: 4,
        title: "تطوير مهارات القراءة النقدية",
        description: "تعلم كيفية قراءة وتحليل النصوص بشكل نقدي وعميق.",
        image: "sard.png/2.png",
        price: 99,
        originalPrice: 199,
        type: "online",
        level: "intermediate",
        duration: "6 ساعات",
        students: 734,
        rating: 4.5,
        reviews: 156,
        instructor: "محمد علي",
        category: "القراءة النقدية",
        featured: true,
        content: "دورة متخصصة في تطوير مهارات القراءة النقدية والتحليلية.",
        modules: 4,
        certificate: true
    },
    {
        id: 5,
        title: "كتابة السيناريو والحوار",
        description: "تعلم فنون كتابة السيناريو والحوار الدرامي للأفلام والمسلسلات.",
        image: "sard.png/1.png",
        price: 249,
        originalPrice: 499,
        type: "online",
        level: "advanced",
        duration: "15 ساعة",
        students: 567,
        rating: 4.9,
        reviews: 134,
        instructor: "سارة الحسن",
        category: "كتابة السيناريو",
        featured: true,
        content: "دورة متقدمة في فنون كتابة السيناريو والحوار الدرامي.",
        modules: 10,
        certificate: true
    },
    {
        id: 6,
        title: "التحرير والمراجعة اللغوية",
        description: "تعلم مهارات التحرير والمراجعة اللغوية الاحترافية.",
        image: "sard.png/2.png",
        price: 129,
        originalPrice: 259,
        type: "offline",
        level: "intermediate",
        duration: "9 ساعات",
        students: 892,
        rating: 4.7,
        reviews: 201,
        instructor: "د. علي الخليفة",
        category: "التحرير اللغوي",
        featured: false,
        content: "دورة عملية في التحرير والمراجعة اللغوية الاحترافية.",
        modules: 7,
        certificate: true
    },
    {
        id: 7,
        title: "الكتابة الصحفية والإخبارية",
        description: "تعلم أساسيات الكتابة الصحفية والإخبارية الاحترافية.",
        image: "sard.png/1.png",
        price: 0,
        originalPrice: 0,
        type: "online",
        level: "beginner",
        duration: "7 ساعات",
        students: 1456,
        rating: 4.4,
        reviews: 289,
        instructor: "أحمد الكعبي",
        category: "الكتابة الصحفية",
        featured: false,
        content: "دورة مجانية في أساسيات الكتابة الصحفية والإخبارية.",
        modules: 5,
        certificate: true
    },
    {
        id: 8,
        title: "الكتابة الإعلانية والتسويقية",
        description: "تعلم كيفية كتابة إعلانات وحملات تسويقية فعّالة.",
        image: "sard.png/2.png",
        price: 179,
        originalPrice: 359,
        type: "online",
        level: "intermediate",
        duration: "11 ساعة",
        students: 1089,
        rating: 4.6,
        reviews: 223,
        instructor: "ليلى الأحمد",
        category: "الكتابة الإعلانية",
        featured: false,
        content: "دورة شاملة في الكتابة الإعلانية والتسويقية الفعّالة.",
        modules: 8,
        certificate: true
    }
];

// ============================================
// نظام إدارة الدورات
// ============================================

class CoursesManager {
    constructor() {
        this.courses = [...coursesData];
        this.filteredCourses = [...coursesData];
        this.selectedFilters = {
            price: [],
            type: [],
            level: []
        };
        this.sortBy = 'newest';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCourses();
        this.updateStats();
        this.renderRecommended();
    }

    setupEventListeners() {
        // البحث
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // الفلاتر
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFilter(e));
        });

        // إعادة تعيين الفلاتر
        const resetBtn = document.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // الترتيب
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // النوافذ المنبثقة
        this.setupModals();
    }

    setupModals() {
        const courseModal = document.getElementById('courseModal');
        const enrollModal = document.getElementById('enrollModal');
        const modalCloseButtons = document.querySelectorAll('.modal-close');

        // إغلاق النوافذ
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // إغلاق عند النقر خارج النافذة
        [courseModal, enrollModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });

        // نموذج التسجيل
        const enrollForm = document.getElementById('enrollForm');
        if (enrollForm) {
            enrollForm.addEventListener('submit', (e) => this.handleEnrollment(e));
        }
    }

    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        const noResults = document.getElementById('noResults');

        if (!coursesGrid) return;

        if (this.filteredCourses.length === 0) {
            coursesGrid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        coursesGrid.style.display = 'grid';
        noResults.style.display = 'none';

        coursesGrid.innerHTML = this.filteredCourses.map(course => this.createCourseCard(course)).join('');

        // إضافة مستمعي الأحداث للأزرار
        document.querySelectorAll('.enroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = parseInt(e.target.dataset.courseId);
                this.showEnrollModal(courseId);
            });
        });

        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.enroll-btn')) {
                    const courseId = parseInt(card.dataset.courseId);
                    this.showCourseDetails(courseId);
                }
            });
        });
    }

    createCourseCard(course) {
        const priceDisplay = course.price === 0 
            ? '<span class="free-badge">مجاني</span>'
            : `<div class="course-price">
                <span class="price">₪${course.price}</span>
                ${course.originalPrice ? `<span class="original-price">₪${course.originalPrice}</span>` : ''}
              </div>`;

        const featuredClass = course.featured ? 'featured' : '';

        return `
            <div class="course-card ${featuredClass}" data-course-id="${course.id}">
                <div class="course-header">
                    <img src="${course.image}" alt="${course.title}" class="course-image" onerror="this.style.display='none'">
                    <span class="course-badge ${course.price === 0 ? 'free' : 'paid'}">
                        ${course.price === 0 ? 'مجاني' : 'مدفوع'}
                    </span>
                    <span class="course-type ${course.type}">${course.type === 'online' ? 'أونلاين' : 'وجاهي'}</span>
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    
                    <div class="course-details">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${course.duration}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${this.formatNumber(course.students)} متدرب</span>
                        </div>
                    </div>

                    <div class="course-rating">
                        <div class="stars">
                            ${this.createStars(course.rating)}
                        </div>
                        <span class="rating-count">${course.rating} (${course.reviews} تقييم)</span>
                    </div>

                    ${priceDisplay}

                    <div class="course-actions">
                        <button class="enroll-btn btn primary" data-course-id="${course.id}">
                            <i class="fas fa-check-circle"></i>
                            التسجيل
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<span class="star">★</span>';
            } else if (i - 0.5 <= rating) {
                stars += '<span class="star">⯨</span>';
            } else {
                stars += '<span class="star empty">☆</span>';
            }
        }
        return stars;
    }

    formatNumber(num) {
        return num.toLocaleString('ar-SA');
    }

    handleSearch(query) {
        query = query.toLowerCase().trim();
        
        this.filteredCourses = this.courses.filter(course => {
            return course.title.toLowerCase().includes(query) ||
                   course.description.toLowerCase().includes(query) ||
                   course.instructor.toLowerCase().includes(query) ||
                   course.category.toLowerCase().includes(query);
        });

        this.applyFilters();
        this.applySorting();
        this.renderCourses();
    }

    handleFilter(event) {
        const checkbox = event.target;
        const filterType = checkbox.dataset.filter;
        const filterValue = checkbox.value;

        if (checkbox.checked) {
            if (!this.selectedFilters[filterType].includes(filterValue)) {
                this.selectedFilters[filterType].push(filterValue);
            }
        } else {
            this.selectedFilters[filterType] = this.selectedFilters[filterType].filter(v => v !== filterValue);
        }

        this.applyFilters();
        this.applySorting();
        this.renderCourses();
    }

    applyFilters() {
        this.filteredCourses = this.courses.filter(course => {
            // فلتر السعر
            if (this.selectedFilters.price.length > 0) {
                const isPaid = this.selectedFilters.price.includes('paid');
                const isFree = this.selectedFilters.price.includes('free');
                
                const courseIsPaid = course.price > 0;
                const courseMeetsPrice = (isPaid && courseIsPaid) || (isFree && !courseIsPaid);
                
                if (!courseMeetsPrice) return false;
            }

            // فلتر النوع
            if (this.selectedFilters.type.length > 0) {
                if (!this.selectedFilters.type.includes(course.type)) return false;
            }

            // فلتر المستوى
            if (this.selectedFilters.level.length > 0) {
                if (!this.selectedFilters.level.includes(course.level)) return false;
            }

            return true;
        });
    }

    handleSort(sortOption) {
        this.sortBy = sortOption;
        this.applySorting();
        this.renderCourses();
    }

    applySorting() {
        switch (this.sortBy) {
            case 'newest':
                this.filteredCourses.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                this.filteredCourses.sort((a, b) => b.students - a.students);
                break;
            case 'rating':
                this.filteredCourses.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                this.filteredCourses.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredCourses.sort((a, b) => b.price - a.price);
                break;
        }
    }

    resetFilters() {
        this.selectedFilters = {
            price: [],
            type: [],
            level: []
        };

        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.filteredCourses = [...this.courses];
        this.applySorting();
        this.renderCourses();

        window.notifier?.show('تم إعادة تعيين الفلاتر', 'success', 2000);
    }

    showCourseDetails(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        const modal = document.getElementById('courseModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <button class="modal-close" aria-label="إغلاق">&times;</button>
            <h2>${course.title}</h2>
            
            <div class="course-meta">
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span><strong>المدرب:</strong> ${course.instructor}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span><strong>الفئة:</strong> ${course.category}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span><strong>المدة:</strong> ${course.duration}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-book"></i>
                    <span><strong>الوحدات:</strong> ${course.modules}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-users"></i>
                    <span><strong>المتدربون:</strong> ${this.formatNumber(course.students)}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-star"></i>
                    <span><strong>التقييم:</strong> ${course.rating} ⭐</span>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <h3>وصف الدورة</h3>
                <p>${course.content}</p>
            </div>

            <div style="margin: 1.5rem 0;">
                <h3>معلومات إضافية</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem 0;"><i class="fas fa-check" style="color: var(--accent-gold); margin-left: 0.5rem;"></i>شهادة معتمدة</li>
                    <li style="padding: 0.5rem 0;"><i class="fas fa-check" style="color: var(--accent-gold); margin-left: 0.5rem;"></i>محتوى تفاعلي</li>
                    <li style="padding: 0.5rem 0;"><i class="fas fa-check" style="color: var(--accent-gold); margin-left: 0.5rem;"></i>دعم مستمر</li>
                    <li style="padding: 0.5rem 0;"><i class="fas fa-check" style="color: var(--accent-gold); margin-left: 0.5rem;"></i>وصول مدى الحياة</li>
                </ul>
            </div>

            <button class="enroll-btn btn primary" style="width: 100%; padding: 1rem;" data-course-id="${courseId}">
                التسجيل في الدورة
            </button>
        `;

        // إضافة مستمع للزر الجديد
        modalBody.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modalBody.querySelector('.enroll-btn').addEventListener('click', () => {
            modal.style.display = 'none';
            this.showEnrollModal(courseId);
        });

        modal.style.display = 'flex';
    }

    showEnrollModal(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        const modal = document.getElementById('enrollModal');
        const form = document.getElementById('enrollForm');

        // تخزين معرف الدورة
        form.dataset.courseId = courseId;

        // ملء معلومات الدورة
        const courseInfo = form.querySelector('.course-info') || document.createElement('div');
        if (!form.querySelector('.course-info')) {
            courseInfo.className = 'course-info';
            courseInfo.style.cssText = `
                background: #f9f7f3;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                border-right: 3px solid var(--accent-gold);
            `;
            form.insertBefore(courseInfo, form.firstChild);
        }

        courseInfo.innerHTML = `
            <h4 style="color: var(--primary-brown); margin-bottom: 0.5rem;">${course.title}</h4>
            <p style="color: #666; margin: 0; font-size: 0.9rem;">
                <i class="fas fa-user" style="margin-left: 0.5rem;"></i> ${course.instructor}
            </p>
        `;

        modal.style.display = 'flex';
    }

    handleEnrollment(event) {
        event.preventDefault();

        const form = event.target;
        const courseId = parseInt(form.dataset.courseId);
        const course = this.courses.find(c => c.id === courseId);

        // التحقق من صحة النموذج
        if (!form.checkValidity()) {
            window.notifier?.show('يرجى ملء جميع الحقول المطلوبة', 'error', 3000);
            return;
        }

        // جمع البيانات
        const enrollmentData = {
            courseId: courseId,
            courseName: course.title,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            specialization: document.getElementById('specialization').value,
            message: document.getElementById('message').value,
            enrollmentDate: new Date().toISOString()
        };

        // حفظ البيانات
        this.saveEnrollment(enrollmentData);

        // إغلاق النموذج
        document.getElementById('enrollModal').style.display = 'none';

        // إعادة تعيين النموذج
        form.reset();

        // عرض رسالة النجاح
        window.notifier?.show(
            `تم التسجيل بنجاح في دورة "${course.title}"! سيتم التواصل معك قريباً.`,
            'success',
            4000
        );
    }

    saveEnrollment(data) {
        try {
            const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
            enrollments.push(data);
            localStorage.setItem('enrollments', JSON.stringify(enrollments));
        } catch (error) {
            console.error('خطأ في حفظ بيانات التسجيل:', error);
        }
    }

    updateStats() {
        const totalCourses = document.getElementById('totalCourses');
        const totalStudents = document.getElementById('totalStudents');
        const avgRating = document.getElementById('avgRating');

        if (totalCourses) {
            totalCourses.textContent = `${this.courses.length} دورة`;
        }

        if (totalStudents) {
            const students = this.courses.reduce((sum, c) => sum + c.students, 0);
            totalStudents.textContent = `${this.formatNumber(students)} متدرب`;
        }

        if (avgRating) {
            const avg = (this.courses.reduce((sum, c) => sum + c.rating, 0) / this.courses.length).toFixed(1);
            avgRating.textContent = `${avg} ⭐`;
        }
    }

    renderRecommended() {
        const recommendedContainer = document.getElementById('recommendedCourses');
        if (!recommendedContainer) return;

        // اختيار أفضل 3 دورات
        const recommended = this.courses
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        recommendedContainer.innerHTML = recommended.map(course => `
            <div class="recommended-item" data-course-id="${course.id}">
                <h4>${course.title}</h4>
                <p>${course.instructor}</p>
                <div class="recommended-rating">
                    <div class="stars">
                        ${this.createStars(course.rating)}
                    </div>
                    <span class="rating-count">${course.rating}</span>
                </div>
            </div>
        `).join('');

        // إضافة مستمعي الأحداث
        recommendedContainer.querySelectorAll('.recommended-item').forEach(item => {
            item.addEventListener('click', () => {
                const courseId = parseInt(item.dataset.courseId);
                this.showCourseDetails(courseId);
            });
        });
    }
}

// ============================================
// تهيئة التطبيق
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new CoursesManager();
    // في ملف courses-enhanced.js

// بيانات الدورات
const coursesData = [
    {
        id: 1,
        title: "فن الكتابة الإبداعية للمحتوى الرقمي",
        description: "تدريب متقدم يركز على صياغة المحتوى الجذاب لمنصات التواصل والمدونات",
        type: "online",
        price: 199,
        originalPrice: 399,
        duration: "١٢ ساعة تدريب",
        students: 1247,
        rating: 4.7,
        instructor: "ندى الصاوي",
        category: "writing"
    },
    {
        id: 2,
        title: "ورشة الإلقاء والخطابة المؤثرة",
        description: "ورشة عمل مكثفة تُعقد في مقر سرد لتعلم تقنيات الإلقاء المؤثر",
        type: "offline",
        price: 0,
        duration: "٨ ساعات تدريب",
        students: 894,
        rating: 5.0,
        instructor: "أحمد المنصوري",
        category: "public-speaking"
    }
    // ... المزيد من الدورات
];

// المتغيرات العامة
let currentCourseId = null;

// فتح نافذة التسجيل
function openEnrollModal(courseId) {
    currentCourseId = courseId;
    const course = coursesData.find(c => c.id === courseId);
    
    if (!course) return;
    
    // تعبئة معاينة الدورة
    const preview = document.getElementById('enrollCoursePreview');
    preview.innerHTML = `
        <div class="preview-content">
            <h4>${course.title}</h4>
            <div class="preview-details">
                <span class="preview-instructor">
                    <i class="fas fa-chalkboard-teacher"></i>
                    ${course.instructor}
                </span>
                <span class="preview-duration">
                    <i class="fas fa-clock"></i>
                    ${course.duration}
                </span>
                <span class="preview-price">
                    ${course.price === 0 ? 
                        '<span class="free-badge">مجانية</span>' : 
                        `<span class="price">${course.price} د.أ</span>`
                    }
                </span>
            </div>
        </div>
    `;
    
    // إظهار النافذة
    document.getElementById('enrollModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // إضافة تأثير الظهور
    setTimeout(() => {
        document.querySelector('.enroll-modal').classList.add('show');
    }, 10);
}

// إغلاق نافذة التسجيل
function closeEnrollModal() {
    const modal = document.getElementById('enrollModal');
    const modalContent = document.querySelector('.enroll-modal');
    
    modalContent.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('enrollForm').reset();
        currentCourseId = null;
    }, 300);
}

// معالجة التسجيل
async function handleEnrollment(event) {
    event.preventDefault();
    
    if (!currentCourseId) {
        showNotification('لم يتم تحديد دورة', 'error');
        return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.fa-spinner');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // التحقق من البيانات
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    
    if (!fullName || !email) {
        showNotification('يرجى ملء الحقول الإلزامية', 'warning');
        return;
    }
    
    if (!formData.get('agreeTerms')) {
        showNotification('يرجى الموافقة على الشروط والأحكام', 'warning');
        return;
    }
    
    // إظهار حالة التحميل
    btnText.textContent = 'جاري التسجيل...';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        // محاكاة إرسال البيانات (استبدل هذا بالاتصال الحقيقي بالخادم)
        await submitEnrollment(formData, currentCourseId);
        
        // إظهار رسالة النجاح
        showNotification('تم التسجيل في الدورة بنجاح! سنتواصل معك قريباً', 'success');
        
        // إغلاق النافذة بعد نجاح التسجيل
        setTimeout(() => {
            closeEnrollModal();
        }, 2000);
        
    } catch (error) {
        showNotification('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى', 'error');
    } finally {
        // إعادة تعيين الزر
        btnText.textContent = 'تأكيد التسجيل';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// محاكاة إرسال بيانات التسجيل
async function submitEnrollment(formData, courseId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // محاكاة نجاح أو فشل عشوائي (في التطبيق الحقيقي، استبدل هذا بالاتصال بالخادم)
            const success = Math.random() > 0.2; // 80% نجاح
            
            if (success) {
                // حفظ بيانات التسجيل محلياً (في التطبيق الحقيقي، أرسل للخادم)
                const enrollment = {
                    courseId: courseId,
                    userData: {
                        fullName: formData.get('fullName'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        country: formData.get('country'),
                        specialization: formData.get('specialization'),
                        experience: formData.get('experience'),
                        message: formData.get('message')
                    },
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                };
                
                // حفظ في localStorage
                const enrollments = JSON.parse(localStorage.getItem('sard_enrollments') || '[]');
                enrollments.push(enrollment);
                localStorage.setItem('sard_enrollments', JSON.stringify(enrollments));
                
                resolve(enrollment);
            } else {
                reject(new Error('فشل في الاتصال بالخادم'));
            }
        }, 2000);
    });
}

// إغلاق النافذة عند النقر خارجها
document.getElementById('enrollModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEnrollModal();
    }
});

// إغلاق النافذة بالزر Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEnrollModal();
    }
});

// تحديث واجهة زر التسجيل بعد التسجيل الناجح
function updateEnrollButton(courseId) {
    const enrollBtn = document.querySelector(`[onclick="openEnrollModal(${courseId})"]`);
    if (enrollBtn) {
        enrollBtn.innerHTML = '<i class="fas fa-check"></i> مسجل';
        enrollBtn.classList.add('enrolled');
        enrollBtn.disabled = true;
        enrollBtn.onclick = null;
    }
}

// التحقق من التسجيلات السابقة
function checkExistingEnrollments() {
    const enrollments = JSON.parse(localStorage.getItem('sard_enrollments') || '[]');
    enrollments.forEach(enrollment => {
        updateEnrollButton(enrollment.courseId);
    });
}

// استدعاء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkExistingEnrollments();
});
});
