/**
 * AI Library - Smart Assistant for Sard Digital Platform
 * Handles all AI-related interactions in the frontend
 */
class AILibrary {
    constructor() {
        this.conversation = [];
        this.isTyping = false;
        this.conversationId = this.generateConversationId();
        this.init();
    }

    /**
     * Initialize the AI Library
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize DOM elements
            this.chat = document.getElementById('chatMessages');
            this.input = document.getElementById('aiInput');
            this.btn = document.getElementById('sendAiBtn');
            this.clearBtn = document.getElementById('clearChatBtn');
            this.voiceBtn = document.getElementById('voiceInputBtn');
            this.characterCount = document.getElementById('characterCount');
            this.maxChars = 2000;

            // Check if required elements exist
            if (!this.chat || !this.input || !this.btn) {
                console.error('Required elements not found');
                return;
            }

            // Event listeners
            this.btn.addEventListener('click', () => this.send());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.send();
                }
            });

            // Clear chat button
            if (this.clearBtn) {
                this.clearBtn.addEventListener('click', () => this.clearConversation());
            }

            // Voice input button
            if (this.voiceBtn) {
                this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
            }

            // Character counter
            if (this.characterCount) {
                this.input.addEventListener('input', () => this.updateCharCount());
                this.updateCharCount();
            }

            // Set welcome message with current time
            const welcomeTime = document.getElementById('welcomeTime');
            if (welcomeTime) {
                welcomeTime.textContent = this.getFormattedTime();
            }

            // Load any saved conversation
            this.loadConversation();
        });
    }

    /**
     * Generate a unique conversation ID
     */
    generateConversationId() {
        return 'conv_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get formatted time
     */
    getFormattedTime() {
        return new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Add a message to the chat
     */
    addMessage(text, sender = 'ai', metadata = {}) {
        if (!text) return;

        const messageId = 'msg_' + Date.now();
        const timestamp = new Date().toISOString();
        const timeString = this.getFormattedTime();
        
        // Create message element
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;
        div.id = messageId;
        
        // Set message content based on sender
        const avatar = sender === 'user' 
            ? '<i class="fas fa-user"></i>' 
            : '<i class="fas fa-robot"></i>';
            
        const name = sender === 'user' ? 'أنت' : 'مساعد سرد';
        
        // Format message with markdown support (simple implementation)
        const formattedText = this.formatMessage(text);
        
        div.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <h4>${name}</h4>
                    <span class="message-time" data-timestamp="${timestamp}">${timeString}</span>
                </div>
                <div class="message-text">${formattedText}</div>
                ${this.getMessageActions(sender, messageId)}
            </div>
        `;
        
        // Add to chat
        this.chat.appendChild(div);
        this.chat.scrollTop = this.chat.scrollHeight;
        
        // Add to conversation history
        this.conversation.push({
            id: messageId,
            sender,
            text,
            timestamp,
            metadata
        });
        
        // Save conversation to localStorage
        this.saveConversation();
        
        return div;
    }

    /**
     * Format message text (supports basic markdown)
     */
    formatMessage(text) {
        if (!text) return '';
        
        // Simple markdown to HTML conversion
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
            .replace(/\*(.*?)\*/g, '<em>$1</em>')               // *italic*
            .replace(/`(.*?)`/g, '<code>$1</code>')             // `code`
            .replace(/\n/g, '<br>')                            // New lines
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); // [text](url)
    }

    /**
     * Get action buttons for messages
     */
    getMessageActions(sender, messageId) {
        if (sender === 'ai') {
            return `
                <div class="message-actions">
                    <button class="btn-copy" data-message-id="${messageId}" title="نسخ النص">
                        <i class="far fa-copy"></i>
                    </button>
                    <button class="btn-feedback" data-message-id="${messageId}" data-rating="1" title="التقييم">
                        <i class="far fa-thumbs-up"></i>
                    </button>
                </div>
            `;
        }
        return '';
    }

    /**
     * Update character count
     */
    updateCharCount() {
        if (!this.characterCount) return;
        const count = this.input.value.length;
        this.characterCount.textContent = `${count}/${this.maxChars}`;
        this.characterCount.className = count > this.maxChars ? 'text-danger' : 'text-muted';
        this.btn.disabled = count === 0 || count > this.maxChars;
    }

    /**
     * Send message to AI
     */
    async send() {
        // Prevent sending empty messages or while typing
        const text = (this.input.value || '').trim();
        if (!text || this.isTyping) return;
        
        // Clear input and add message to chat
        this.input.value = '';
        this.updateCharCount();
        
        // Add user message to chat
        this.addMessage(text, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Prepare request data
            const requestData = {
                query: text,
                query_type: this.detectQueryType(text),
                conversation_id: this.conversationId,
                metadata: {
                    user_agent: navigator.userAgent,
                    language: navigator.language,
                    timestamp: new Date().toISOString()
                }
            };
            
            // Send request to backend
            const response = await fetch('/api/ai/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add AI response to chat
            if (data.success && data.data) {
                this.addMessage(
                    data.data.response, 
                    'ai', 
                    { 
                        query_type: data.data.query_type,
                        context: data.data.context,
                        model: data.data.model
                    }
                );
            } else {
                throw new Error(data.message || 'حدث خطأ غير متوقع');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            this.showError('حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.');
        }
    }

    /**
     * Detect query type based on content
     */
    detectQueryType(text) {
        const lowerText = text.toLowerCase();
        
        if (/(كتاب|كتب|رواية|قصة|مقال)/.test(lowerText)) return 'book';
        if (/(مؤلف|كاتب|شاعر|أديب)/.test(lowerText)) return 'author';
        if (/(كيفية|كيف|طريقة|نصيحة|مساعدة|مساعدة في الكتابة)/.test(lowerText)) return 'writing_help';
        if (/(بحث|دراسة|مصادر|مراجع)/.test(lowerText)) return 'research';
        
        return 'general';
    }

    /**
     * Get authentication token
     */
    getAuthToken() {
        // This is a placeholder - implement your actual token retrieval logic
        return localStorage.getItem('authToken') || '';
    }

    /**
     * Show typing indicator
     */
    showTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <h4>مساعد سرد</h4>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chat.appendChild(typingDiv);
        this.chat.scrollTop = this.chat.scrollHeight;
    }

    /**
     * Hide typing indicator
     */
    hideTyping() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = message;
        
        // Add to chat
        this.chat.appendChild(errorDiv);
        this.chat.scrollTop = this.chat.scrollHeight;
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Clear conversation
     */
    clearConversation() {
        if (!confirm('هل أنت متأكد من رغبتك في مسح محادثتك الحالية؟')) {
            return;
        }
        
        // Clear chat UI
        this.chat.innerHTML = '';
        
        // Clear conversation history
        this.conversation = [];
        
        // Generate new conversation ID
        this.conversationId = this.generateConversationId();
        
        // Clear saved conversation
        localStorage.removeItem('sard_ai_conversation');
        
        // Add welcome message
        this.addMessage(
            'مرحباً! أنا مساعدك الذكي في منصة سرد. كيف يمكنني مساعدتك اليوم؟', 
            'ai',
            { isSystem: true }
        );
    }

    /**
     * Toggle voice input
     */
    toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            this.showError('عذراً، التعرف الصوتي غير مدعوم في متصفحك.');
            return;
        }
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ar-SA'; // Saudi Arabic
        
        // Update button state
        const voiceBtn = document.getElementById('voiceInputBtn');
        if (voiceBtn) {
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                this.input.value = transcript;
                this.updateCharCount();
                this.send();
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.showError('حدث خطأ في التعرف الصوتي. يرجى المحاولة مرة أخرى.');
        };
        
        recognition.onend = () => {
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
        
        // Start recognition
        recognition.start();
    }

    /**
     * Save conversation to localStorage
     */
    saveConversation() {
        try {
            // Only save the last 20 messages to prevent localStorage overflow
            const recentMessages = this.conversation.slice(-20);
            localStorage.setItem('sard_ai_conversation', JSON.stringify({
                id: this.conversationId,
                messages: recentMessages,
                updatedAt: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }

    /**
     * Load conversation from localStorage
     */
    loadConversation() {
        try {
            const saved = localStorage.getItem('sard_ai_conversation');
            if (!saved) {
                // Add welcome message for new users
                this.addMessage(
                    'مرحباً! أنا مساعدك الذكي في منصة سرد. كيف يمكنني مساعدتك اليوم؟', 
                    'ai',
                    { isSystem: true }
                );
                return;
            }
            
            const data = JSON.parse(saved);
            this.conversationId = data.id || this.conversationId;
            
            // Restore messages
            if (Array.isArray(data.messages)) {
                data.messages.forEach(msg => {
                    this.addMessage(msg.text, msg.sender, msg.metadata);
                });
            }
            
        } catch (error) {
            console.error('Error loading conversation:', error);
            // Clear corrupted data
            localStorage.removeItem('sard_ai_conversation');
            
            // Add welcome message
            this.addMessage(
                'مرحباً! أنا مساعدك الذكي في منصة سرد. كيف يمكنني مساعدتك اليوم؟', 
                'ai',
                { isSystem: true }
            );
        }
    }
}

// Initialize the AI Library when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => { 
    window.aiLibrary = new AILibrary(); 
});