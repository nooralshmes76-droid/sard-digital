// ملف: js/user-settings.js
class UserSettings {
    constructor() {
        this.userData = null;
        this.init();
    }

    async init() {
        // جلب بيانات المستخدم عند تحميل الصفحة
        await this.fetchUserData();
        this.setupEventListeners();
        this.renderUserData();
    }

    async fetchUserData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('فشل في جلب بيانات المستخدم');
            }

            this.userData = await response.json();
            this.renderUserData();
        } catch (error) {
            console.error('حدث خطأ:', error);
            this.showNotification('حدث خطأ في جلب البيانات', 'error');
        }
    }

    async updateUserData(updatedData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('فشل في تحديث البيانات');
            }

            const result = await response.json();
            this.showNotification('تم تحديث البيانات بنجاح', 'success');
            return result;
        } catch (error) {
            console.error('حدث خطأ:', error);
            this.showNotification('حدث خطأ في تحديث البيانات', 'error');
            throw error;
        }
    }

    renderUserData() {
        if (!this.userData) return;

        // تحديث البيانات الأساسية
        document.querySelector('.user-avatar').src = this.userData.avatar || 'https://via.placeholder.com/80/8B4513/FFFFFF?text=أ';
        document.querySelector('.user-info h3').textContent = this.userData.full_name || 'زائر';
        
        // تحديث الإحصائيات
        document.querySelectorAll('.stat-item')[0].querySelector('span').textContent = `${this.userData.postsCount || 0} منشور`;
        document.querySelectorAll('.stat-item')[1].querySelector('span').textContent = `${this.userData.commentsCount || 0} تعليق`;
        document.querySelectorAll('.stat-item')[2].querySelector('span').textContent = `${this.userData.likesCount || 0} إعجاب`;
        
        // تحديث آخر النشاطات
        this.renderRecentActivity();
    }

    renderRecentActivity() {
        // يمكن إضافة عرض النشاطات الأخيرة هنا
    }

    setupEventListeners() {
        // إضافة مستمعات الأحداث للأزرار والنماذج
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.openEditModal());
        }

        const saveChangesBtn = document.getElementById('saveChangesBtn');
        if (saveChangesBtn) {
            saveChangesBtn.addEventListener('click', () => this.handleSaveChanges());
        }
    }

    openEditModal() {
        // فتح نافذة تعديل الملف الشخصي
        const modal = document.getElementById('editProfileModal');
        if (!modal) return;

        // تعبئة النموذج بالبيانات الحالية
        const form = modal.querySelector('form');
        form.elements.full_name.value = this.userData.full_name || '';
        form.elements.email.value = this.userData.email || '';
        form.elements.bio.value = this.userData.bio || '';
        
        // إظهار النافذة
        modal.style.display = 'flex';
    }

    async handleSaveChanges() {
        const form = document.querySelector('#editProfileModal form');
        if (!form) return;

        const formData = {
            full_name: form.elements.full_name.value,
            email: form.elements.email.value,
            bio: form.elements.bio.value,
            // يمكن إضافة المزيد من الحقول حسب الحاجة
        };

        try {
            await this.updateUserData(formData);
            this.userData = { ...this.userData, ...formData };
            this.renderUserData();
            this.closeEditModal();
        } catch (error) {
            console.error('فشل في تحديث البيانات:', error);
        }
    }

    closeEditModal() {
        const modal = document.getElementById('editProfileModal');
        if (modal) modal.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // يمكن تنفيذ إشعار للمستخدم
        alert(message);
    }
}

// تهيئة الكلاس عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.userSettings = new UserSettings();
});
