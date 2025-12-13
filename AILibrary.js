// ملف: AILibrary.js - محدث ومحسّن
class AILibrary {
    constructor() {
        this.conversation = [];
        this.isTyping = false;
        this.pageLinks = {
            'الرئيسية': '../index.html',
            'الدورات': 'courses.html',
            'عالم سرد': 'sard-world.html',
            'عن سرد': 'about-sard.html',
            'تسجيل الدخول': 'login.html',
            'ساحة النقاش': '../index.html',
            'منشوراتي': 'my-posts.html',
            'دوراتي': 'my-courses.html',
            'المحفوظات': 'bookmarks.html',
            'المكتبة الذكية': 'ai-library.html'
        };
        this.init();
    }

    init() {
        console.log('🤖 بدء تحميل المكتبة الذكية...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeLibrary();
            });
        } else {
            this.initializeLibrary();
        }
    }

    initializeLibrary() {
        console.log('🔧 تهيئة المكتبة الذكية...');
        
        const chatMessages = document.getElementById('chatMessages');
        const aiInput = document.getElementById('aiInput');
        const sendBtn = document.getElementById('sendAiBtn');
        
        if (chatMessages && aiInput && sendBtn) {
            this.setupEventListeners();
            this.loadConversation();
            this.setWelcomeTime();
            this.showWelcomeMessage();
            console.log('✅ المكتبة الذكية جاهزة للعمل!');
        } else {
            console.error('❌ عناصر المكتبة الذكية غير موجودة في الصفحة');
            this.showErrorMessage();
        }
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('sendAiBtn');
        const aiInput = document.getElementById('aiInput');

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // تحسينات تجربة المستخدم
        aiInput.addEventListener('focus', () => {
            aiInput.style.borderColor = '#654321';
            aiInput.style.boxShadow = '0 0 0 3px rgba(101, 67, 33, 0.1)';
        });

        aiInput.addEventListener('blur', () => {
            aiInput.style.borderColor = '#8B4513';
            aiInput.style.boxShadow = 'none';
        });

        // إضافة اقتراحات تلقائية
        aiInput.addEventListener('input', this.debounce(() => {
            this.showSuggestions(aiInput.value);
        }, 300));
    }

    showWelcomeMessage() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages.querySelector('.welcome-message')) {
            const welcomeMsg = `
                <div class="message ai-message welcome-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <h4>مساعد سرد</h4>
                        <p>مرحباً بك في <strong>المكتبة الذكية</strong>! 🤖</p>
                        <p>أنا مساعدك الشخصي في رحلتك مع المعرفة والكتب. يمكنني مساعدتك في:</p>
                        <ul>
                            <li>📚 <strong>البحث عن الكتب والمراجع</strong> المناسبة لاهتماماتك</li>
                            <li>🎓 <strong>اقتراح الدورات التعليمية</strong> المتعلقة بالأدب والكتابة</li>
                            <li>💡 <strong>الإجابة على أسئلتك</strong> حول المحتوى الأدبي والمعرفي</li>
                            <li>🗺️ <strong>توجيهك بين صفحات سرد</strong> المختلفة</li>
                            <li>📖 <strong>تقديم ملخصات الكتب</strong> ومراجعاتها</li>
                        </ul>
                        <p>جرب أن تسألني عن: <em>"كتب عن الكتابة الإبداعية"</em> أو <em>"دورات متاحة"</em> أو <em>"اذهب إلى الدورات"</em></p>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                </div>
            `;
            chatMessages.innerHTML += welcomeMsg;
        }
    }

    async sendMessage() {
        if (this.isTyping) {
            this.showNotification('المساعد يكتب الآن، انتظر قليلاً...', 'info');
            return;
        }

        const input = document.getElementById('aiInput');
        const message = input.value.trim();

        if (!message) {
            this.showNotification('يرجى كتابة رسالة أولاً', 'warning');
            input.focus();
            return;
        }

        if (message.length > 500) {
            this.showNotification('الرسالة طويلة جداً (الحد الأقصى 500 حرف)', 'warning');
            return;
        }

        // إضافة رسالة المستخدم
        this.addMessage(message, 'user');
        input.value = '';

        // إظهار مؤشر الكتابة
        this.showTypingIndicator();
        this.isTyping = true;

        try {
            // محاولة الاتصال بالخادم أولاً
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            // Fallback إلى الردود المحلية
            this.hideTypingIndicator();
            const localResponse = this.generateAIResponse(message);
            this.addMessage(localResponse, 'ai');
        }

        this.isTyping = false;
    }

    async getAIResponse(message) {
        try {
            // محاولة الاتصال بخادم الذكاء الاصطناعي
            const response = await fetch('/api/ai/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: message,
                    conversation: this.conversation
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.reply || data.answer || 'شكراً لسؤالك!';
            }
        } catch (error) {
            console.log('🔄 استخدام الردود المحلية...');
        }

        // محاكاة اتصال الشبكة
        await new Promise(resolve => 
            setTimeout(resolve, 1000 + Math.random() * 1000)
        );

        throw new Error('لا يوجد اتصال بالخادم');
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';
        
        const senderName = sender === 'user' ? 'أنت' : 'مساعد سرد';
        const messageId = 'msg_' + Date.now();

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                <h4>${senderName}</h4>
                <p>${this.formatMessage(content)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        // تأثير الظهور
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        chatMessages.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);

        this.scrollToBottom();

        // حفظ في المحادثة
        this.conversation.push({
            id: messageId,
            sender,
            content,
            timestamp: new Date().toISOString()
        });
        
        this.saveConversation();
    }

    formatMessage(content) {
        let formattedContent = content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        formattedContent = this.addNavigationLinks(formattedContent);
        formattedContent = this.addBookRecommendations(formattedContent);
        
        return formattedContent;
    }

    addNavigationLinks(content) {
        let enhancedContent = content;
        
        Object.keys(this.pageLinks).forEach(pageName => {
            const regex = new RegExp(`\\b(${pageName})\\b`, 'gi');
            if (regex.test(enhancedContent)) {
                enhancedContent = enhancedContent.replace(
                    regex, 
                    `<a href="${this.pageLinks[pageName]}" class="nav-link-inline" onclick="handleNavigation('${this.pageLinks[pageName]}')">$1</a>`
                );
            }
        });
        
        return enhancedContent;
    }

    addBookRecommendations(content) {
        // اكتشاف أسماء الكتب وإضافة روابط لها
        const bookTitles = {
            'حدود السرد الرقمي': '/books/digital-narrative',
            'الأجندة المعرفية': '/books/knowledge-agenda',
            'دليل الكتابة الإبداعية': '/books/creative-writing',
            'فن الحوار الأدبي': '/books/literary-dialogue'
        };

        let enhancedContent = content;
        
        Object.keys(bookTitles).forEach(bookTitle => {
            const regex = new RegExp(`"(${bookTitle})"`, 'gi');
            if (regex.test(enhancedContent)) {
                enhancedContent = enhancedContent.replace(
                    regex, 
                    `"<a href="${bookTitles[bookTitle]}" class="book-link">$1</a>"`
                );
            }
        });
        
        return enhancedContent;
    }

    generateAIResponse(userMessage) {
        console.log('🧠 توليد رد للرسالة:', userMessage);
        
        const lowerMessage = userMessage.toLowerCase();
        
        const knowledgeBase = {
            'كتاب': {
                responses: [
                    'أهلاً بك! 📚 لدينا مجموعة واسعة من الكتب في مختلف المجالات. هل تبحث عن كتاب معين أو تفضل أن أقترح عليك بعض العناوين المميزة؟',
                    'رائع! الكتب كنز لا يفنى. أي مجال يهمك؟ الأدب، العلم، التاريخ، الفلسفة، أم التطوير الذاتي؟',
                    'في مكتبة سرد، لدينا أكثر من 500 كتاب متنوع. أخبرني باهتماماتك وسأرشح لك أفضل العناوين! 📖'
                ]
            },
            
            'دورة': {
                responses: [
                    'لدينا العديد من <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">الدورات</a> الرائعة! 🎓 أي مجال تريد تعلمه؟ البرمجة، التصميم، الكتابة، أم شيء آخر؟',
                    'التعلم مستمر! تصفح <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">دوراتنا</a> واختر ما يناسب اهتماماتك. أي تخصص يثير فضولك؟',
                    'في <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">قسم الدورات</a> ستجد مسارات تعليمية متكاملة. أخبرني بمستواك وسأساعدك في الاختيار!'
                ]
            },
            
            'قصة': {
                responses: [
                    'القصص كنز ثمين! 📖 لدينا قصص تعليمية، خيالية، واقعية، وتاريخية. أي نوع من القصص يثير اهتمامك؟',
                    'أحب القصص! هي نافذة إلى عوالم مختلفة. هل تفضل القصص القصيرة أم الروايات الطويلة؟',
                    'في <a href="sard-world.html" class="nav-link-inline" onclick="handleNavigation(\'sard-world.html\')">عالم سرد</a>، نحول القصص إلى تجارب تفاعلية. أي نوع تفضل؟'
                ]
            },
            
            'تعلم': {
                responses: [
                    'رحلة التعلم لا تنتهي! 🚀 ما الموضوع الذي ترغب في استكشافه؟ لدينا مصادر تعليمية متنوعة تناسب جميع المستويات.',
                    'التعلم مستمر مدى الحياة! لدينا <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">دورات</a> في البرمجة، التصميم، الكتابة، والعديد من المجالات.',
                    'في منصة سرد، نؤمن بالتعلم التفاعلي. أخبرني بمجال اهتمامك وسأدلك على أفضل المصادر!'
                ]
            },
            
            'برمجة': {
                responses: [
                    'عالم البرمجة رائع! 💻 لدينا <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">دورات</a> في HTML, CSS, JavaScript, Python وغيرها. أي لغة تريد تعلمها؟',
                    'البرمجة لغة العصر! هل تبدأ من الصفر أم لديك خبرة سابقة؟ سأساعدك في اختيار المسار المناسب من <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">دوراتنا</a>.',
                    'في سرد، نعلم البرمجة بطريقة عملية. أخبرني بمستواك وسأرشح لك الدورة المناسبة!'
                ]
            },
            
            'تصميم': {
                responses: [
                    'التصميم فن وإبداع! 🎨 يمكنني مساعدتك في تصميم الويب، الجرافيك، أو UI/UX. ما مجال اهتمامك؟',
                    'التصميم يجعل العالم أجمل! لدينا <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">دورات تصميم</a> متخصصة. أي نوع تفضل؟',
                    'لدينا في سرد مسارات متكاملة للتصميم. أخبرني بشغفك وسأدلك على البداية الصحيحة!'
                ]
            },
            
            'سرد': {
                responses: [
                    'مرحباً بك في منصة سرد! 🌟 نحن منصة تعليمية تهدف إلى نشر المعرفة العربية. كيف يمكنني خدمتك؟',
                    'سرد هو مجتمع للمتعلمين والمبدعين. نحول المعرفة إلى تجارب تفاعلية. كيف يمكنني مساعدتك اليوم؟',
                    'أهلاً بك في عائلة سرد! نحن هنا لنساعدك في رحلة التعلم والإبداع. ما الذي تبحث عنه؟'
                ]
            },
            
            'ملخص': {
                responses: [
                    'يمكنني مساعدتك في تقديم ملخصات للكتب التالية:\n\n• <a href="#" class="book-link">"حدود السرد الرقمي"</a>\n• <a href="#" class="book-link">"الأجندة المعرفية"</a>\n• <a href="#" class="book-link">"دليل الكتابة الإبداعية"</a>\n• <a href="#" class="book-link">"فن الحوار الأدبي"</a>\n\nأي كتاب تريد ملخصاً له؟',
                    'التلخيص فن! 📝 أي كتاب تريد ملخصاً له؟ لدينا ملخصات للعديد من الكتب في مكتبة سرد.',
                    'الملخصات توفر الوقت وتثري المعرفة. أخبرني باسم الكتاب وسأقدم لك ملخصاً شاملاً!'
                ]
            },
            
            'اذهب': {
                responses: [
                    'يمكنني مساعدتك في التنقل بين صفحات سرد:\n\n📍 <a href="../index.html" class="nav-link-inline" onclick="handleNavigation(\'../index.html\')">الرئيسية</a> - ساحة النقاش\n🎓 <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">الدورات</a> - التعلم المتخصص\n🌍 <a href="sard-world.html" class="nav-link-inline" onclick="handleNavigation(\'sard-world.html\')">عالم سرد</a> - القصص التفاعلية\n🤖 <a href="ai-library.html" class="nav-link-inline" onclick="handleNavigation(\'ai-library.html\')">المكتبة الذكية</a> - مساعد التعلم\n👤 <a href="login.html" class="nav-link-inline" onclick="handleNavigation(\'login.html\')">تسجيل الدخول</a> - دخول الأعضاء',
                    'إليك روابط سرد الرئيسية:\n\n• <a href="../index.html" class="nav-link-inline" onclick="handleNavigation(\'../index.html\')">الرئيسية</a> - مجتمع النقاش\n• <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">الدورات</a> - مسارات تعليمية\n• <a href="sard-world.html" class="nav-link-inline" onclick="handleNavigation(\'sard-world.html\')">عالم سرد</a> - مغامرات تفاعلية\n• <a href="about-sard.html" class="nav-link-inline" onclick="handleNavigation(\'about-sard.html\')">عن سرد</a> - تعرف علينا',
                    'أين تريد الذهاب؟\n\n📚 <a href="../index.html" class="nav-link-inline" onclick="handleNavigation(\'../index.html\')">ساحة النقاش</a>\n🎯 <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">الدورات التعليمية</a>\n🚀 <a href="sard-world.html" class="nav-link-inline" onclick="handleNavigation(\'sard-world.html\')">عالم سرد التفاعلي</a>\nℹ️ <a href="about-sard.html" class="nav-link-inline" onclick="handleNavigation(\'about-sard.html\')">معلومات عنا</a>'
                ]
            },
            
            'مساعدة': {
                responses: [
                    'يمكنني مساعدتك في:\n\n🔍 **البحث عن المحتوى**: كتب، دورات، مقالات\n📚 **التوصيات**: اقتراح كتب ودورات تناسب اهتماماتك\n🗺️ **التنقل**: توجيهك بين أقسام المنصة\n💡 **المعلومات**: الإجابة على أسئلتك حول المحتوى\n📖 **الملخصات**: تقديم ملخصات للكتب المهمة\n\nما الذي تحتاج مساعدة فيه؟',
                    'أنا هنا لمساعدتك! يمكنني:\n\n• البحث عن الكتب والدورات المناسبة\n• الإجابة على استفساراتك المعرفية\n• توجيهك للموارد التعليمية\n• تقديم نصائح للقراءة والتعلم\n\nما هو سؤالك؟'
                ]
            }
        };

        // البحث عن أفضل تطابق
        for (const [keyword, data] of Object.entries(knowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                return randomResponse;
            }
        }

        // الرد الافتراضي
        const defaultResponses = [
            'شكراً لسؤالك المميز! 🤔 يمكنني مساعدتك في البحث عن الكتب، الدورات التعليمية، أو تقديم نصائح تعليمية. ما الذي تريد معرفته بالضبط؟',
            'سؤال جميل! 💫 يمكنني مساعدتك في:\n\n📚 البحث عن الكتب والمراجع\n🎓 اقتراح الدورات المناسبة\n🗺️ التنقل بين صفحات المنصة\n💡 الإجابة على استفساراتك\n\nأخبرني بما تبحث عنه!',
            'أفهم أنك تبحث عن معرفة جديدة! 🌟 يمكنني:\n\n• إرشادك إلى <a href="courses.html" class="nav-link-inline" onclick="handleNavigation(\'courses.html\')">الدورات المناسبة</a>\n• مساعدتك في <a href="../index.html" class="nav-link-inline" onclick="handleNavigation(\'../index.html\')">ساحة النقاش</a>\n• تقديم مصادر تعليمية مفيدة\n\nما المجال الذي يهمك؟'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

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
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    setWelcomeTime() {
        const welcomeTime = document.getElementById('welcomeTime');
        if (welcomeTime) {
            welcomeTime.textContent = this.getCurrentTime();
        }
    }

    showNotification(message, type = 'info') {
        if (window.sardApp && window.sardApp.showNotification) {
            window.sardApp.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    showErrorMessage() {
        const chatContainer = document.querySelector('.ai-chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>عذراً، حدث خطأ في تحميل المكتبة الذكية</h3>
                    <p>يرجى تحديث الصفحة أو التواصل مع الدعم الفني</p>
                    <button onclick="location.reload()" class="retry-btn">
                        <i class="fas fa-redo"></i> إعادة تحميل
                    </button>
                </div>
            `;
        }
    }

    saveConversation() {
        try {
            localStorage.setItem('sard_ai_conversation', JSON.stringify(this.conversation));
        } catch (error) {
            console.error('❌ خطأ في حفظ المحادثة:', error);
        }
    }

    loadConversation() {
        try {
            const saved = localStorage.getItem('sard_ai_conversation');
            if (saved) {
                this.conversation = JSON.parse(saved);
                // عرض المحادثة المحفوظة
                this.displaySavedConversation();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل المحادثة:', error);
        }
    }

    displaySavedConversation() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages || this.conversation.length === 0) return;

        // مسح الرسالة الترحيبية الافتراضية
        const welcomeMsg = chatMessages.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        // عرض المحادثة المحفوظة
        this.conversation.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}-message`;
            
            const avatar = msg.sender === 'user' ? 
                '<i class="fas fa-user"></i>' : 
                '<i class="fas fa-robot"></i>';
            
            const senderName = msg.sender === 'user' ? 'أنت' : 'مساعد سرد';

            messageDiv.innerHTML = `
                <div class="message-avatar">
                    ${avatar}
                </div>
                <div class="message-content">
                    <h4>${senderName}</h4>
                    <p>${this.formatMessage(msg.content)}</p>
                    <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString('ar-EG', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
        });

        this.scrollToBottom();
    }

    clearConversation() {
        if (confirm('هل تريد مسح كل محادثاتك مع المساعد؟')) {
            this.conversation = [];
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '';
                this.showWelcomeMessage();
            }
            localStorage.removeItem('sard_ai_conversation');
            this.showNotification('تم مسح المحادثة بنجاح', 'success');
        }
    }

    showSuggestions(query) {
        // إظهار اقتراحات أثناء الكتابة (ميزة متقدمة)
        if (query.length < 2) return;

        const suggestions = this.generateSuggestions(query);
        // تنفيذ عرض الاقتراحات في واجهة المستخدم
    }

    generateSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('كتاب')) {
            suggestions.push('أقترح كتب عن الكتابة الإبداعية', 'كتب تطوير الذات', 'روايات عربية');
        }
        
        if (lowerQuery.includes('دورة')) {
            suggestions.push('دورات كتابة', 'دورات برمجة', 'دورات تصميم');
        }

        return suggestions;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    getStats() {
        return {
            totalMessages: this.conversation.length,
            userMessages: this.conversation.filter(msg => msg.sender === 'user').length,
            aiMessages: this.conversation.filter(msg => msg.sender === 'ai').length,
            lastActivity: this.conversation.length > 0 ? 
                this.conversation[this.conversation.length - 1].timestamp : null
        };
    }
}

// دالة التنقل العالمية
function handleNavigation(url) {
    console.log('🧭 التنقل إلى:', url);
    
    // تأثير انتقال سلس
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// تهيئة المكتبة الذكية
if (typeof window !== 'undefined') {
    if (!window.aiLibrary) {
        window.aiLibrary = new AILibrary();
    }
}

// إضافة أنماط إضافية للمكتبة الذكية
const addAIStyles = () => {
    if (!document.querySelector('#ai-styles')) {
        const styles = `
            <style id="ai-styles">
                .nav-link-inline {
                    color: #8B4513;
                    text-decoration: none;
                    font-weight: 600;
                    border-bottom: 1px dashed #8B4513;
                    transition: all 0.3s ease;
                }
                .nav-link-inline:hover {
                    color: #654321;
                    border-bottom-style: solid;
                }
                .book-link {
                    color: #784428;
                    text-decoration: none;
                    font-weight: 500;
                }
                .book-link:hover {
                    text-decoration: underline;
                }
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    padding: 10px 0;
                }
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #8B4513;
                    animation: typing 1.4s infinite ease-in-out;
                }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
                .error-message {
                    text-align: center;
                    padding: 40px 20px;
                    color: #8B4513;
                }
                .error-message i {
                    font-size: 48px;
                    margin-bottom: 20px;
                    color: #e74c3c;
                }
                .retry-btn {
                    background: #8B4513;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: #654321;
                    transform: translateY(-2px);
                }
                .welcome-message ul {
                    margin: 10px 0;
                    padding-right: 20px;
                }
                .welcome-message li {
                    margin-bottom: 8px;
                    line-height: 1.5;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
};

// إضافة الأنماط عند التحميل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAIStyles);
} else {
    addAIStyles();
}
