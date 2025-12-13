/* api.js — طبقة التكيف (Adapter): محاولة الاتصال بـ backend ثم fallback إلى localSt// الدوال الرئيسية التي يستخدمها الفرونت:
3	   - api.register(formData)
4	   - api.login(email, password)
5	   - api.getCurrentUser()
6	   - api.fetchPosts()
7	   - api.createPost(post)
8	   - api.likePost(postId)
9	   - api.addComment(postId, commentText)
10	   - api.deletePost(postId)
11	   - api.uploadFile(file)
12	   - api.fetchCourses()
13	   - api.fetchCourseById(courseId)
14	   - api.enrollCourse(courseId)
15	   - api.fetchArticles()
16	   - api.fetchArticleBySlug(slug)
17	   - api.sendAIQuery(query)
18	   - api.getAdminStats()
19	   - api.upsertArticle(articleData, articleId)
20	   - api.deleteAdminArticle(articleId)
21	   - api.upsertCourse(courseData, courseId)
22	   - api.deleteAdminCourse(courseId)
23	   - api.logout()st api = (function(){
    // Base URL for API requests
const BASE = window.location.origin; // Automatically use current origin (supports both dev and prod)
    const timeout = (ms) => new Promise(res => setTimeout(res, ms));
    // Increase timeout to 15 seconds to handle slow connections
const DEFAULT_TIMEOUT = 15000; // 15 seconds

    // ===== FETCH WITH TIMEOUT =====
    async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const res = await fetch(BASE + url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            
            const contentType = res.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }
            
            return { 
                ok: res.ok, 
                status: res.status, 
                data: data,
                headers: res.headers
            };
        } catch(err) {
            clearTimeout(id);
            if (err.name === 'AbortError') {
                return { 
                ok: false, 
                error: 'timeout', 
                message: 'انتهت مهلة الانتظار. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى' 
            };
            }
            return { ok: false, error: err.message };
        }
    }

    // ===== VALIDATION HELPERS =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password && password.length >= 6;
    }

    // ===== PUBLIC API =====
    return {
        // Register new user
        register: async function(userObj) {
            // Validate input
            if (!userObj.name || userObj.name.trim().length < 3) {
                return { success: false, message: 'الاسم يجب أن يكون 3 أحرف على الأقل' };
            }
            if (!validateEmail(userObj.email)) {
                return { success: false, message: 'البريد الإلكتروني غير صحيح' };
            }
            if (!validatePassword(userObj.password)) {
                return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
            }

            // Try backend first
            const r = await fetchWithTimeout('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userObj)
            });

            if (r.ok && r.data && r.data.token) {
                // Backend returns flat user object + token
                const { token, ...user } = r.data;
                localStorage.setItem('sard_user', JSON.stringify(user));
                localStorage.setItem('sard_user_token', token);
                return { success: true, remote: true, data: r.data };
            }

            // Fallback: local storage
            const users = JSON.parse(localStorage.getItem('sard_users') || '[]');
            if (users.find(u => u.email === userObj.email)) {
                return { success: false, message: 'البريد مستخدم بالفعل' };
            }

            const newUser = {
                id: Date.now(),
                name: userObj.name,
                email: userObj.email,
                password: userObj.password, // Note: في الإنتاج يجب تشفير كلمة المرور
                avatar: userObj.avatar || '',
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('sard_users', JSON.stringify(users));

            const safe = { ...newUser };
            delete safe.password;
            localStorage.setItem('sard_user', JSON.stringify(safe));
            localStorage.setItem('sard_user_token', 'mock_token_' + Date.now());

            return { success: true, remote: false, data: { user: safe } };
        },

        // Login user
        login: async function(email, password) {
            // Validate input
            if (!validateEmail(email)) {
                return { success: false, message: 'البريد الإلكتروني غير صحيح' };
            }
            if (!password) {
                return { success: false, message: 'كلمة المرور مطلوبة' };
            }

            // Try backend first
            const r = await fetchWithTimeout('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (r.ok && r.data && r.data.token) {
                // Backend returns flat user object + token
                const { token, ...user } = r.data;
                localStorage.setItem('sard_user', JSON.stringify(user));
                localStorage.setItem('sard_user_token', token);
                return { success: true, remote: true, data: r.data };
            }

            // Fallback: check local storage
            const users = JSON.parse(localStorage.getItem('sard_users') || '[]');
            const u = users.find(x => x.email === email && x.password === password);

            if (u) {
                const safe = { id: u.id, name: u.name, email: u.email, avatar: u.avatar || '' };
                localStorage.setItem('sard_user', JSON.stringify(safe));
                localStorage.setItem('sard_user_token', 'mock_token_' + Date.now());
                return { success: true, remote: false, data: { user: safe } };
            }

            return { success: false, message: 'بيانات الدخول غير صحيحة' };
        },

        // Get current user
        getCurrentUser: function() {
            try {
                return JSON.parse(localStorage.getItem('sard_user') || 'null');
            } catch(e) {
                return null;
            }
        },

        // Get auth token
        getToken: function() {
            return localStorage.getItem('sard_user_token');
        },

        // Logout user
        logout: function() {
            localStorage.removeItem('sard_user');
            localStorage.removeItem('sard_user_token');
            window.location.href = 'index.html';
        },

        // Fetch posts
        fetchPosts: async function(options = {}) {
            const { sort = 'latest', limit = 20, page = 1 } = options;
            const query = new URLSearchParams({ sort, limit, page }).toString();

            const r = await fetchWithTimeout(`/api/posts?${query}`, { method: 'GET' });

            if (r.ok && r.data && Array.isArray(r.data)) { // Backend returns array directly
                return { success: true, data: r.data, remote: true };
            }

            // Fallback: sample posts from localStorage
            const sample = JSON.parse(localStorage.getItem('sard_posts') || '[]');
            return { success: true, data: sample, remote: false };
        },

        // Create post
        createPost: async function(post) {
            // Validate
            if (!post.text || post.text.trim().length < 10) {
                return { success: false, message: 'المنشور يجب أن يكون 10 أحرف على الأقل' };
            }

            const token = localStorage.getItem('sard_user_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout('/api/posts', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(post)
            });

            if (r.ok && r.data) {
                return { success: true, remote: true, data: r.data };
            }

            // Fallback: push to localStorage
            const posts = JSON.parse(localStorage.getItem('sard_posts') || '[]');
            const newPost = {
                id: Date.now(),
                ...post,
                created_at: new Date().toISOString(),
                likes: 0,
                comments: 0
            };
            posts.unshift(newPost);
            localStorage.setItem('sard_posts', JSON.stringify(posts));

            return { success: true, remote: false, data: newPost };
        },
        
        // Like or unlike a post
        likePost: async function(postId) {
            const token = localStorage.getItem('sard_user_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout(`/api/posts/like/${postId}`, {
                method: 'PUT',
                headers: headers
            });

            if (r.ok && r.data) {
                return { success: true, remote: true, data: r.data };
            }

            return { success: false, message: 'فشل الإعجاب بالمنشور' };
        },

        // Add a comment to a post
        addComment: async function(postId, commentText) {
            if (!commentText || commentText.trim().length === 0) {
                return { success: false, message: 'نص التعليق مطلوب' };
            }
            
            const token = localStorage.getItem('sard_user_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout(`/api/posts/comment/${postId}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ text: commentText })
            });

            if (r.ok && r.data) {
                return { success: true, remote: true, data: r.data };
            }

            return { success: false, message: 'فشل إضافة التعليق' };
        },

        // Delete a post
        deletePost: async function(postId) {
            const token = localStorage.getItem('sard_user_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: headers
            });

            if (r.ok) {
                return { success: true, remote: true, data: r.data };
            }

            return { success: false, message: 'فشل حذف المنشور' };
        },

        // Upload file (Keep as is, assuming /api/uploads/presign will be implemented later or is a placeholder)
        uploadFile: async function(file) {
            // Validate file
            if (!file || !(file instanceof File)) {
                return { success: false, message: 'ملف غير صحيح' };
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                return { success: false, message: 'حجم الملف كبير جداً (أقصى 10MB)' };
            }

            // Try presign
            const r = await fetchWithTimeout('/api/uploads/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    filename: file.name, 
                    contentType: file.type 
                })
            });

            if (r.ok && r.data && r.data.uploadUrl && r.data.publicUrl) {
                try {
                    const uploadRes = await fetch(r.data.uploadUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': file.type },
                        body: file
                    });

                    if (uploadRes.ok) {
                        return { success: true, url: r.data.publicUrl, remote: true };
                    }
                } catch(err) {
                    console.error('Upload error:', err);
                }
            }

            // Fallback: create local blob URL
            const url = URL.createObjectURL(file);
            return { success: true, url, fallback: true };
        },

        // Fetch courses
        fetchCourses: async function() {
            const r = await fetchWithTimeout('/api/courses', { method: 'GET' });

            if (r.ok && r.data && Array.isArray(r.data)) { // Backend returns array directly
                return { success: true, data: r.data, remote: true };
            }

            const sample = JSON.parse(localStorage.getItem('sard_courses') || '[]');
            return { success: true, data: sample, remote: false };
        },
        
        // Fetch single course
        fetchCourseById: async function(courseId) {
            const r = await fetchWithTimeout(`/api/courses/${courseId}`, { method: 'GET' });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'لم يتم العثور على الدورة' };
        },

        // Enroll in course
        enrollCourse: async function(courseId) {
            const token = localStorage.getItem('sard_user_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Corrected path to match backend: /api/courses/enroll/:id
            const r = await fetchWithTimeout(`/api/courses/enroll/${courseId}`, {
                method: 'POST',
                headers: headers
            });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل التسجيل في الدورة' };
        },
        
        // Fetch all articles (Blog)
        fetchArticles: async function() {
            const r = await fetchWithTimeout('/api/blog', { method: 'GET' });

            if (r.ok && r.data && Array.isArray(r.data)) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل جلب المقالات' };
        },

        // Fetch single article by slug
        fetchArticleBySlug: async function(slug) {
            const r = await fetchWithTimeout(`/api/blog/${slug}`, { method: 'GET' });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'لم يتم العثور على المقال' };
        },

        // Send query to AI Desk
        sendAIQuery: async function(query) {
            const token = localStorage.getItem('sard_user_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout('/api/ai/query', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ query })
            });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل الاتصال بالمكتب الذكي' };
        },

        // --- Admin Functions ---
        
        // Get Admin Dashboard Stats
        getAdminStats: async function() {
            const token = localStorage.getItem('sard_user_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout('/api/admin/stats', {
                method: 'GET',
                headers: headers
            });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل جلب إحصائيات لوحة التحكم' };
        },

        // Upsert (Create/Update) Article
        upsertArticle: async function(articleData, articleId = null) {
            const token = localStorage.getItem('sard_user_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const method = articleId ? 'PUT' : 'POST';
            const url = articleId ? `/api/admin/articles/${articleId}` : '/api/admin/articles';

            const r = await fetchWithTimeout(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(articleData)
            });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل حفظ المقال' };
        },

        // Delete Article
        deleteAdminArticle: async function(articleId) {
            const token = localStorage.getItem('sard_user_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout(`/api/admin/articles/${articleId}`, {
                method: 'DELETE',
                headers: headers
            });

            if (r.ok) {
                return { success: true, remote: true };
            }

            return { success: false, message: 'فشل حذف المقال' };
        },

        // Upsert (Create/Update) Course
        upsertCourse: async function(courseData, courseId = null) {
            const token = localStorage.getItem('sard_user_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const method = courseId ? 'PUT' : 'POST';
            const url = courseId ? `/api/admin/courses/${courseId}` : '/api/admin/courses';

            const r = await fetchWithTimeout(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(courseData)
            });

            if (r.ok && r.data) {
                return { success: true, data: r.data, remote: true };
            }

            return { success: false, message: 'فشل حفظ الدورة' };
        },

        // Delete Course
        deleteAdminCourse: async function(courseId) {
            const token = localStorage.getItem('sard_user_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const r = await fetchWithTimeout(`/api/admin/courses/${courseId}`, {
                method: 'DELETE',
                headers: headers
            });

            if (r.ok) {
                return { success: true, remote: true };
            }

            return { success: false, message: 'فشل حذف الدورة' };
        }
    };
})();
