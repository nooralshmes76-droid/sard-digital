// Import the auth module for JWT and user session management
import { getCurrentUser, updateUserProfile, uploadUserAvatar } from './auth.js';

class ProfileManager {
    constructor() {
        this.user = null;
        this.initElements();
        this.initEventListeners();
        this.loadUserProfile();
    }

    // Initialize DOM elements
    initElements() {
        // Profile elements
        this.elements = {
            // Profile header
            profileAvatar: document.getElementById('profileAvatar'),
            userFullName: document.getElementById('userFullName'),
            userRole: document.getElementById('userRole'),
            bioText: document.getElementById('bioText'),
            
            // Personal info
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            country: document.getElementById('country'),
            address: document.getElementById('address'),
            
            // Stats
            postsCount: document.getElementById('postsCount'),
            commentsCount: document.getElementById('commentsCount'),
            joinDate: document.getElementById('joinDate'),
            
            // Modal elements
            modal: document.getElementById('editProfileModal'),
            editProfileBtn: document.getElementById('editProfileBtn'),
            closeEditModal: document.getElementById('closeEditModal'),
            cancelEdit: document.getElementById('cancelEdit'),
            profileForm: document.getElementById('profileForm'),
            saveProfileChanges: document.getElementById('saveProfileChanges'),
            
            // Form fields
            editFullName: document.getElementById('editFullName'),
            editEmail: document.getElementById('editEmail'),
            editPhone: document.getElementById('editPhone'),
            editCountry: document.getElementById('editCountry'),
            editAddress: document.getElementById('editAddress'),
            editBio: document.getElementById('editBio'),
            
            // Avatar change
            changeAvatarBtn: document.getElementById('changeAvatarBtn'),
            avatarInput: null
        };
        
        // Create a hidden file input for avatar upload
        this.createHiddenFileInput();
    }
    
    // Create a hidden file input for avatar uploads
    createHiddenFileInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.onchange = (e) => this.handleAvatarUpload(e);
        document.body.appendChild(input);
        this.elements.avatarInput = input;
    }

    // Initialize event listeners
    initEventListeners() {
        // Modal controls
        this.elements.editProfileBtn?.addEventListener('click', () => this.openEditModal());
        this.elements.closeEditModal?.addEventListener('click', () => this.closeEditModal());
        this.elements.cancelEdit?.addEventListener('click', () => this.closeEditModal());
        
        // Close modal when clicking outside the content
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeEditModal();
            }
        });
        
        // Form submission
        this.elements.profileForm?.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        
        // Avatar change
        this.elements.changeAvatarBtn?.addEventListener('click', () => this.triggerAvatarUpload());
    }
    
    // Load user profile data
    async loadUserProfile() {
        try {
            this.showLoading(true);
            
            // Get the current user data
            const user = await getCurrentUser();
            
            if (!user) {
                // Redirect to login if not authenticated
                window.location.href = 'login.html';
                return;
            }
            
            this.user = user;
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showNotification('حدث خطأ في تحميل بيانات الملف الشخصي', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Update the UI with user data
    updateUI() {
        if (!this.user) return;
        
        const { user } = this;
        
        // Update profile header
        if (user.avatar) {
            this.elements.profileAvatar.src = user.avatar;
        } else {
            // Generate initials avatar if no avatar is set
            const name = user.full_name || 'U';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            this.elements.profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
        }
        
        this.elements.userFullName.textContent = user.full_name || 'مستخدم';
        this.elements.fullName.textContent = user.full_name || 'غير محدد';
        this.elements.email.textContent = user.email || 'غير محدد';
        this.elements.phone.textContent = user.phone || 'غير محدد';
        this.elements.country.textContent = user.country || 'غير محدد';
        this.elements.address.textContent = user.address || 'غير محدد';
        
        // Update bio if exists
        if (user.bio) {
            this.elements.bioText.textContent = user.bio;
        } else {
            this.elements.bioText.textContent = 'لم يتم إضافة وصف شخصي بعد';
        }
        
        // Update stats
        this.elements.postsCount.textContent = user.postsCount || 0;
        this.elements.commentsCount.textContent = user.commentsCount || 0;
        
        // Format join date
        if (user.createdAt) {
            const joinDate = new Date(user.createdAt);
            this.elements.joinDate.textContent = joinDate.toLocaleDateString('ar-SA');
        } else {
            this.elements.joinDate.textContent = 'غير معروف';
        }
        
        // Update user role
        if (user.role === 'admin') {
            this.elements.userRole.textContent = 'مدير النظام';
            this.elements.userRole.classList.add('admin-badge');
        } else {
            this.elements.userRole.textContent = 'مستخدم';
            this.elements.userRole.classList.remove('admin-badge');
        }
    }
    
    // Open the edit profile modal
    openEditModal() {
        if (!this.user) return;
        
        // Populate form with current user data
        this.elements.editFullName.value = this.user.full_name || '';
        this.elements.editEmail.value = this.user.email || '';
        this.elements.editPhone.value = this.user.phone || '';
        this.elements.editCountry.value = this.user.country || '';
        this.elements.editAddress.value = this.user.address || '';
        this.elements.editBio.value = this.user.bio || '';
        
        // Show the modal
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close the edit profile modal
    closeEditModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Handle profile form submission
    async handleProfileUpdate(e) {
        e.preventDefault();
        
        if (!this.user) return;
        
        try {
            // Show loading state
            this.setFormLoading(true);
            
            // Get form data
            const formData = {
                full_name: this.elements.editFullName.value.trim(),
                email: this.elements.editEmail.value.trim(),
                phone: this.elements.editPhone.value.trim() || null,
                country: this.elements.editCountry.value || null,
                address: this.elements.editAddress.value.trim() || null,
                bio: this.elements.editBio.value.trim() || null
            };
            
            // Validate required fields
            if (!formData.full_name || !formData.email) {
                throw new Error('الاسم الكامل والبريد الإلكتروني حقول مطلوبة');
            }
            
            // Update user profile
            const updatedUser = await updateUserProfile(formData);
            
            // Update local user data
            this.user = { ...this.user, ...updatedUser };
            
            // Update UI
            this.updateUI();
            
            // Close modal
            this.closeEditModal();
            
            // Show success message
            this.showNotification('تم تحديث الملف الشخصي بنجاح', 'success');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification(
                error.message || 'حدث خطأ أثناء تحديث الملف الشخصي', 
                'error'
            );
        } finally {
            this.setFormLoading(false);
        }
    }
    
    // Trigger the hidden file input for avatar upload
    triggerAvatarUpload() {
        this.elements.avatarInput.click();
    }
    
    // Handle avatar upload
    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('الرجاء اختيار صورة صالحة', 'error');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // Upload the avatar
            const result = await uploadUserAvatar(file);
            
            // Update the avatar in the UI
            if (result.avatar) {
                this.elements.profileAvatar.src = result.avatar;
                this.showNotification('تم تحديث الصورة الشخصية بنجاح', 'success');
                
                // Update the user object
                if (this.user) {
                    this.user.avatar = result.avatar;
                }
            }
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            this.showNotification(
                error.message || 'حدث خطأ أثناء رفع الصورة', 
                'error'
            );
        } finally {
            this.showLoading(false);
            // Reset the file input
            this.elements.avatarInput.value = '';
        }
    }
    
    // Set loading state for the form
    setFormLoading(isLoading) {
        const btn = this.elements.saveProfileChanges;
        if (!btn) return;
        
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
    
    // Show loading overlay
    showLoading(show) {
        // You can implement a global loading overlay here if needed
        if (show) {
            document.body.style.cursor = 'wait';
        } else {
            document.body.style.cursor = '';
        }
    }
    
    // Show notification to the user
    showNotification(message, type = 'info') {
        // You can implement a more sophisticated notification system here
        alert(`[${type.toUpperCase()}] ${message}`);
    }
}

// Initialize the profile manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the profile page
    if (document.querySelector('.profile-container')) {
        window.profileManager = new ProfileManager();
    }
});
