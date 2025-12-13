// API base URL - update this to your actual API endpoint
const API_BASE_URL = 'http://localhost:3000/api'; // Update with your actual backend URL

// Get the authentication token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Make authenticated API requests
async function apiRequest(url, options = {}) {
    const token = getAuthToken();
    
    // Set default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        // Handle unauthorized (401) responses
        if (response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token');
            window.location.href = 'login.html?session=expired';
            throw new Error('Session expired. Please log in again.');
        }
        
        // Parse JSON response
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'حدث خطأ في الطلب');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Get current user data
async function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    
    try {
        const data = await apiRequest('/users/me');
        return data.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

// Update user profile
async function updateUserProfile(profileData) {
    if (!requireAuth()) return null;
    
    try {
        const data = await apiRequest('/users/update', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        return data.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

// Upload user avatar
async function uploadUserAvatar(file) {
    if (!requireAuth() || !file) return null;
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'فشل رفع الصورة');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'فشل تسجيل الدخول');
        }
        
        // Save token to localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.user;
        }
        
        throw new Error('لم يتم استلام رمز المصادقة');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Make functions available globally
window.auth = {
    getAuthToken,
    isAuthenticated,
    requireAuth,
    apiRequest,
    getCurrentUser,
    updateUserProfile,
    uploadUserAvatar,
    login,
    logout
};

// Also export for module usage
export {
    getAuthToken,
    isAuthenticated,
    requireAuth,
    apiRequest,
    getCurrentUser,
    updateUserProfile,
    uploadUserAvatar,
    login,
    logout
};

// Initialize auth state when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a protected page
    const protectedPages = ['profile.html', 'dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // Only redirect if we're on a protected page and not already on the login page
    if (protectedPages.includes(currentPage) && !isAuthenticated() && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }

    // Update UI based on auth status
    const token = getAuthToken();
    const loginLink = document.getElementById('loginLink');
    const guestStatus = document.getElementById('guestStatus');
    const userGreeting = document.getElementById('userGreeting');
    const userName = document.getElementById('userName');
    const postContent = document.getElementById('postContent');
    
    if (token) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (guestStatus) guestStatus.style.display = 'none';
        if (userGreeting) userGreeting.style.display = 'inline';
        if (postContent) {
            postContent.placeholder = 'ما الذي يدور في ذهنك اليوم؟';
        }
        
        // Load user data
        getCurrentUser().then(user => {
            if (user && userName) {
                userName.textContent = user.full_name || user.email || 'مستخدم';
                // Store user data for later use
                localStorage.setItem('user', JSON.stringify(user));
            }
        }).catch(error => {
            console.error('Error loading user data:', error);
            // If there's an error, log the user out
            logout();
        });
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'inline';
        if (guestStatus) guestStatus.style.display = 'inline';
        if (userGreeting) userGreeting.style.display = 'none';
        if (postContent) {
            postContent.placeholder = 'يرجى تسجيل الدخول للمشاركة في النقاش';
            postContent.readOnly = true;
        }
    }
});
