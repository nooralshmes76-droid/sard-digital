// Discussion Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize discussion features
    const discussion = new Discussion();
});

class Discussion {
    constructor() {
        // DOM Elements
        this.postsContainer = document.getElementById('postsFeed');
        this.postForm = document.getElementById('postForm');
        this.postContent = document.getElementById('postContent');
        this.postImage = document.getElementById('postImage');
        this.imagePreview = document.getElementById('imagePreview');
        this.postTemplate = document.getElementById('postTemplate');
        
        // Initialize
        this.initializeEventListeners();
        this.loadPosts();
        
        // For demo purposes - load sample posts if none exist
        if (!localStorage.getItem('discussionInitialized')) {
            this.initializeSampleData();
            localStorage.setItem('discussionInitialized', 'true');
        }
    }

    initializeEventListeners() {
        // Post form submission
        if (this.postForm) {
            this.postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // Image upload preview
        if (this.postImage) {
            this.postImage.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Handle clicks on like buttons using event delegation
        this.postsContainer?.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                this.toggleLike(likeBtn);
            }
            
            // Handle comment submission
            const commentSubmit = e.target.closest('.comment-submit');
            if (commentSubmit) {
                this.addComment(commentSubmit);
            }
            
            // Toggle comments section
            const commentBtn = e.target.closest('.comment-btn');
            if (commentBtn) {
                this.toggleComments(commentBtn);
            }
        });
    }

    async loadPosts() {
        try {
            // In a real app, this would be an API call
            // const response = await fetch('/api/posts');
            // const posts = await response.json();
            
            // For demo, load from localStorage or use sample data
            const posts = JSON.parse(localStorage.getItem('discussionPosts') || '[]');
            this.renderPosts(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('حدث خطأ أثناء تحميل المنشورات');
        }
    }

    renderPosts(posts) {
        if (!this.postsContainer) return;
        
        // Clear existing posts
        this.postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            this.postsContainer.innerHTML = `
                <div class="no-posts">
                    <i class="far fa-comment-dots"></i>
                    <p>لا توجد منشورات بعد. كن أول من ينشر!</p>
                </div>
            `;
            return;
        }
        
        // Render each post
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.postsContainer.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const postTemplate = this.postTemplate.content.cloneNode(true);
        const postElement = postTemplate.querySelector('.post');
        
        // Set post data
        postElement.dataset.postId = post.id;
        postElement.querySelector('.author-name').textContent = post.author;
        postElement.querySelector('.post-time').textContent = this.formatTimeAgo(post.timestamp);
        postElement.querySelector('.post-text').textContent = post.content;
        postElement.querySelector('.like-count').textContent = post.likes || 0;
        postElement.querySelector('.comment-count').textContent = post.comments?.length || 0;
        
        // Set like status
        if (post.isLiked) {
            const likeBtn = postElement.querySelector('.like-btn');
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').classList.replace('far', 'fas');
        }
        
        // Add image if exists
        if (post.image) {
            const postImage = postElement.querySelector('.post-image');
            postImage.innerHTML = `<img src="${post.image}" alt="صورة المنشور">`;
        }
        
        // Add comments if any
        if (post.comments?.length > 0) {
            const commentsList = postElement.querySelector('.comments-list');
            post.comments.forEach(comment => {
                commentsList.appendChild(this.createCommentElement(comment));
            });
        }
        
        return postElement;
    }
    
    createCommentElement(comment) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="author-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${this.formatTimeAgo(comment.timestamp)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
        return commentElement;
    }

    async handlePostSubmit(e) {
        e.preventDefault();
        
        const content = this.postContent.value.trim();
        if (!content) return;
        
        // In a real app, this would be an API call
        // const formData = new FormData(this.postForm);
        // const response = await fetch('/api/posts', {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // });
        
        // For demo, create a new post object
        const newPost = {
            id: Date.now().toString(),
            author: 'أنت',
            content: content,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            image: this.imagePreview.querySelector('img')?.src || null
        };
        
        // Save to localStorage
        const posts = JSON.parse(localStorage.getItem('discussionPosts') || '[]');
        posts.unshift(newPost); // Add new post to the beginning
        localStorage.setItem('discussionPosts', JSON.stringify(posts));
        
        // Render the new post
        const postElement = this.createPostElement(newPost);
        if (this.postsContainer.firstChild) {
            this.postsContainer.insertBefore(postElement, this.postsContainer.firstChild);
        } else {
            this.postsContainer.appendChild(postElement);
        }
        
        // Reset form
        this.postContent.value = '';
        this.imagePreview.innerHTML = '';
        this.postImage.value = '';
        
        // Show success message
        this.showSuccess('تم نشر منشورك بنجاح');
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            this.showError('الرجاء اختيار صورة صالحة');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
            return;
        }
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (event) => {
            this.imagePreview.innerHTML = `
                <div class="image-preview-container">
                    <img src="${event.target.result}" alt="معاينة الصورة">
                    <button class="remove-image" id="removeImage">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add event listener for remove button
            document.getElementById('removeImage')?.addEventListener('click', () => {
                this.imagePreview.innerHTML = '';
                this.postImage.value = '';
            });
        };
        reader.readAsDataURL(file);
    }

    async toggleLike(button) {
        const postElement = button.closest('.post');
        const postId = postElement.dataset.postId;
        const likeCount = button.querySelector('.like-count') || button.closest('.likes-count').querySelector('.like-count');
        const likeIcon = button.querySelector('i');
        
        // Toggle like state
        const isLiked = button.classList.contains('liked');
        const currentLikes = parseInt(likeCount.textContent) || 0;
        
        // Update UI immediately for better UX
        if (isLiked) {
            button.classList.remove('liked');
            likeIcon.classList.replace('fas', 'far');
            likeCount.textContent = Math.max(0, currentLikes - 1);
        } else {
            button.classList.add('liked');
            likeIcon.classList.replace('far', 'fas');
            likeCount.textContent = currentLikes + 1;
        }
        
        // In a real app, this would be an API call
        // try {
        //     const response = await fetch(`/api/posts/${postId}/like`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`
        //         },
        //         body: JSON.stringify({ like: !isLiked })
        //     });
        //     
        //     if (!response.ok) throw new Error('Failed to update like');
        //     
        //     const result = await response.json();
        //     likeCount.textContent = result.likesCount;
        //     
        //     if (result.liked) {
        //         button.classList.add('liked');
        //     } else {
        //         button.classList.remove('liked');
        //     }
        // } catch (error) {
        //     console.error('Error toggling like:', error);
        //     this.showError('حدث خطأ أثناء تحديث الإعجاب');
        //     
        //     // Revert UI on error
        //     if (isLiked) {
        //         button.classList.add('liked');
        //         likeCount.textContent = currentLikes;
        //     } else {
        //         button.classList.remove('liked');
        //         likeCount.textContent = currentLikes;
        //     }
        // }
    }

    async addComment(button) {
        const postElement = button.closest('.post');
        const postId = postElement.dataset.postId;
        const commentInput = postElement.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        
        if (!commentText) return;
        
        // In a real app, this would be an API call
        // try {
        //     const response = await fetch(`/api/posts/${postId}/comments`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`
        //         },
        //         body: JSON.stringify({ text: commentText })
        //     });
        //     
        //     if (!response.ok) throw new Error('Failed to add comment');
        //     
        //     const newComment = await response.json();
        //     
        //     // Update UI
        //     this.addCommentToUI(postElement, newComment);
        //     commentInput.value = '';
        //     
        //     // Update comment count
        //     const commentCount = postElement.querySelector('.comment-count');
        //     commentCount.textContent = parseInt(commentCount.textContent) + 1;
        //     
        // } catch (error) {
        //     console.error('Error adding comment:', error);
        //     this.showError('حدث خطأ أثناء إضافة التعليق');
        // }
        
        // For demo, create a new comment object
        const newComment = {
            id: `comment-${Date.now()}`,
            author: 'أنت',
            text: commentText,
            timestamp: new Date().toISOString()
        };
        
        // Update UI
        const commentsList = postElement.querySelector('.comments-list');
        commentsList.appendChild(this.createCommentElement(newComment));
        
        // Update comment count
        const commentCount = postElement.querySelector('.comment-count');
        commentCount.textContent = parseInt(commentCount.textContent || '0') + 1;
        
        // Clear input
        commentInput.value = '';
        
        // Save to localStorage
        const posts = JSON.parse(localStorage.getItem('discussionPosts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            if (!posts[postIndex].comments) {
                posts[postIndex].comments = [];
            }
            posts[postIndex].comments.push(newComment);
            localStorage.setItem('discussionPosts', JSON.stringify(posts));
        }
    }
    
    toggleComments(button) {
        const postElement = button.closest('.post');
        const commentsSection = postElement.querySelector('.comments-section');
        
        // Toggle comments visibility
        if (commentsSection.style.display === 'none' || !commentsSection.style.display) {
            commentsSection.style.display = 'block';
            button.classList.add('active');
        } else {
            commentsSection.style.display = 'none';
            button.classList.remove('active');
        }
    }

    // Helper Functions
    formatTimeAgo(timestamp) {
        const now = new Date();
        const postDate = new Date(timestamp);
        const seconds = Math.floor((now - postDate) / 1000);
        
        const intervals = {
            سنة: 31536000,
            شهر: 2592000,
            أسبوع: 604800,
            يوم: 86400,
            ساعة: 3600,
            دقيقة: 60,
            ثانية: 1
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `منذ ${interval} ${unit}`;
            }
        }
        
        return 'الآن';
    }
    
    showError(message) {
        // In a real app, you might want to show a toast notification
        alert(`خطأ: ${message}`);
    }
    
    showSuccess(message) {
        // In a real app, you might want to show a toast notification
        alert(message);
    }
    
    // Sample data for demo
    initializeSampleData() {
        const samplePosts = [
            {
                id: '1',
                author: 'ندى الصاوي',
                content: 'أجد أن الكتاب هو الصديق الأوفى الذي يمنحك آلاف العوالم مقابل ثمن زهيد ووقت قليل. في عصر التكنولوجيا، تبقى القراءة هي الملاذ الآمن للعقل والروح.',
                timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
                likes: 127,
                comments: [
                    {
                        id: 'c1',
                        author: 'أحمد المنصوري',
                        text: 'رائع! أوافقك الرأي تماماً. كتاب "الأجندة المعرفية" غير نظرتي للحياة.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
                    },
                    {
                        id: 'c2',
                        author: 'سارة أحمد',
                        text: 'شكراً لك على هذا المنشور الملهم! هل لديك توصيات لكتب في الأدب العربي؟',
                        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
                    }
                ]
            },
            {
                id: '2',
                author: 'محمد السعيد',
                content: 'اليوم أنهيت قراءة رواية "ذاكرة الجسد" لأحلام مستغانمي. ما رأيكم بها؟',
                timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
                likes: 89,
                comments: [
                    {
                        id: 'c3',
                        author: 'ليلى محمد',
                        text: 'من أجمل ما قرأت في الأدب العربي المعاصر!',
                        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
                    }
                ]
            }
        ];
        
        localStorage.setItem('discussionPosts', JSON.stringify(samplePosts));
    }
}
