// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Voice Search Functionality
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const voiceSearchModal = document.getElementById('voiceSearchModal');
const closeVoice = document.getElementById('closeVoice');
const voiceStatus = document.getElementById('voiceStatus');
const voiceTranscript = document.getElementById('voiceTranscript');

let recognition = null;
let isListening = false;

// Check if browser supports Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        voiceStatus.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        voiceTranscript.textContent = transcript;
        
        if (event.results[event.resultIndex].isFinal) {
            voiceStatus.textContent = 'Processing...';
            // Perform search or action with transcript
            setTimeout(() => {
                performVoiceSearch(transcript);
                closeVoiceSearch();
            }, 1000);
        }
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = 'Error: ' + event.error;
        isListening = false;
    };

    recognition.onend = () => {
        isListening = false;
        if (voiceSearchModal.classList.contains('active')) {
            voiceStatus.textContent = 'Click to try again';
        }
    };
} else {
    voiceSearchBtn.style.display = 'none';
}

voiceSearchBtn.addEventListener('click', () => {
    if (recognition) {
        if (!isListening) {
            voiceSearchModal.classList.add('active');
            recognition.start();
        } else {
            recognition.stop();
            closeVoiceSearch();
        }
    } else {
        alert('Voice search is not supported in your browser.');
    }
});

closeVoice.addEventListener('click', () => {
    if (recognition && isListening) {
        recognition.stop();
    }
    closeVoiceSearch();
});

function closeVoiceSearch() {
    voiceSearchModal.classList.remove('active');
    voiceTranscript.textContent = '';
    voiceStatus.textContent = 'Speak your search query';
}

function performVoiceSearch(query) {
    // Scroll to relevant section or perform search
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('service') || lowerQuery.includes('what do you do')) {
        document.querySelector('a[href="#services"]').click();
    } else if (lowerQuery.includes('project') || lowerQuery.includes('portfolio')) {
        document.querySelector('a[href="#projects"]').click();
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('reach')) {
        document.querySelector('a[href="#contact"]').click();
    } else if (lowerQuery.includes('about')) {
        document.querySelector('a[href="#about"]').click();
    }
}

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (name && email && subject && message) {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ==================== AI CHATBOT WITH CRUD FUNCTIONALITY ====================

// Chatbot State Management
class ChatbotManager {
    constructor() {
        this.messages = [];
        this.conversations = [];
        this.currentConversationId = null;
        this.messageIdCounter = 0;
        this.conversationIdCounter = 0;
        this.loadFromStorage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTimeStamps();
        this.loadConversation(this.currentConversationId);
    }

    // CREATE - Add new message
    createMessage(text, isUser = true) {
        if (!this.currentConversationId) {
            this.createConversation();
        }
        
        const message = {
            id: ++this.messageIdCounter,
            text: text,
            isUser: isUser,
            timestamp: new Date(),
            conversationId: this.currentConversationId
        };
        this.messages.push(message);
        
        // Update conversation messages array
        const conversation = this.conversations.find(conv => conv.id === this.currentConversationId);
        if (conversation) {
            if (!conversation.messages) conversation.messages = [];
            conversation.messages.push(message);
            conversation.updatedAt = new Date();
        }
        
        this.saveToStorage();
        return message;
    }

    // CREATE - Create new conversation
    createConversation() {
        const conversation = {
            id: ++this.conversationIdCounter,
            title: 'New Conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.conversations.push(conversation);
        this.currentConversationId = conversation.id;
        this.messages = [];
        this.saveToStorage();
        this.updateHistoryPanel();
        return conversation;
    }

    // READ - Get all messages
    getMessages(conversationId = null) {
        if (conversationId) {
            return this.messages.filter(msg => msg.conversationId === conversationId);
        }
        return this.messages.filter(msg => msg.conversationId === this.currentConversationId);
    }

    // READ - Get all conversations
    getConversations() {
        return this.conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // UPDATE - Update message
    updateMessage(messageId, newText) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (message) {
            message.text = newText;
            message.updatedAt = new Date();
            this.saveToStorage();
            return message;
        }
        return null;
    }

    // UPDATE - Update conversation
    updateConversation(conversationId, updates) {
        const conversation = this.conversations.find(conv => conv.id === conversationId);
        if (conversation) {
            Object.assign(conversation, updates);
            conversation.updatedAt = new Date();
            this.saveToStorage();
            this.updateHistoryPanel();
            return conversation;
        }
        return null;
    }

    // DELETE - Delete message
    deleteMessage(messageId) {
        const index = this.messages.findIndex(msg => msg.id === messageId);
        if (index > -1) {
            this.messages.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // DELETE - Delete conversation
    deleteConversation(conversationId) {
        const index = this.conversations.findIndex(conv => conv.id === conversationId);
        if (index > -1) {
            this.conversations.splice(index, 1);
            // Delete all messages in this conversation
            this.messages = this.messages.filter(msg => msg.conversationId !== conversationId);
            
            if (this.currentConversationId === conversationId) {
                this.currentConversationId = null;
                this.messages = [];
            }
            this.saveToStorage();
            this.updateHistoryPanel();
            this.renderMessages();
            return true;
        }
        return false;
    }

    // Load conversation
    loadConversation(conversationId) {
        if (!conversationId) {
            this.createConversation();
            return;
        }
        this.currentConversationId = conversationId;
        const conversation = this.conversations.find(conv => conv.id === conversationId);
        if (conversation && conversation.messages) {
            this.messages = conversation.messages;
        } else {
            this.messages = this.getMessages(conversationId);
        }
        this.renderMessages();
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('chatbotMessages', JSON.stringify(this.messages));
        localStorage.setItem('chatbotConversations', JSON.stringify(this.conversations));
        localStorage.setItem('chatbotCounters', JSON.stringify({
            messageId: this.messageIdCounter,
            conversationId: this.conversationIdCounter
        }));
        localStorage.setItem('currentConversationId', this.currentConversationId);
    }

    // Load from localStorage
    loadFromStorage() {
        const savedMessages = localStorage.getItem('chatbotMessages');
        const savedConversations = localStorage.getItem('chatbotConversations');
        const savedCounters = localStorage.getItem('chatbotCounters');
        const savedCurrentId = localStorage.getItem('currentConversationId');

        if (savedMessages) {
            this.messages = JSON.parse(savedMessages).map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
        }
        if (savedConversations) {
            this.conversations = JSON.parse(savedConversations).map(conv => ({
                ...conv,
                createdAt: new Date(conv.createdAt),
                updatedAt: new Date(conv.updatedAt)
            }));
        }
        if (savedCounters) {
            const counters = JSON.parse(savedCounters);
            this.messageIdCounter = counters.messageId || 0;
            this.conversationIdCounter = counters.conversationId || 0;
        }
        if (savedCurrentId) {
            this.currentConversationId = parseInt(savedCurrentId);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotContainer = document.getElementById('chatbotContainer');
        const minimizeChatbot = document.getElementById('minimizeChatbot');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const chatInput = document.getElementById('chatInput');
        const clearChatBtn = document.getElementById('clearChatBtn');
        const chatHistoryBtn = document.getElementById('chatHistoryBtn');
        const chatHistoryPanel = document.getElementById('chatHistoryPanel');
        const closeHistory = document.getElementById('closeHistory');

        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');
            if (chatbotContainer.classList.contains('active')) {
                chatInput.focus();
            }
        });

        minimizeChatbot.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
        });

        sendMessageBtn.addEventListener('click', () => this.sendMessage());
        clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
        chatHistoryBtn.addEventListener('click', () => {
            chatHistoryPanel.classList.toggle('active');
            this.updateHistoryPanel();
        });
        closeHistory.addEventListener('click', () => {
            chatHistoryPanel.classList.remove('active');
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        });
    }

    // Send message
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const messageText = chatInput.value.trim();

        if (!messageText) return;

        if (!this.currentConversationId) {
            this.createConversation();
        }

        // Create user message
        const userMessage = this.createMessage(messageText, true);
        this.renderMessage(userMessage);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Update conversation title if it's the first user message
        if (this.getMessages().length === 1) {
            const title = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
            this.updateConversation(this.currentConversationId, { title });
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        const aiResponse = await this.getAIResponse(messageText);
        
        // Remove typing indicator
        this.removeTypingIndicator();

        // Create and render AI message
        const botMessage = this.createMessage(aiResponse, false);
        this.renderMessage(botMessage);

        // Update conversation timestamp
        this.updateConversation(this.currentConversationId, { updatedAt: new Date() });
        this.updateHistoryPanel();
        this.scrollToBottom();
    }

    // AI Response Generator (Mock AI - Replace with real API)
    async getAIResponse(userMessage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const lowerMessage = userMessage.toLowerCase();

        // Service-related queries
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            return "We offer comprehensive IT services including web development, digital marketing, UI/UX design, cloud solutions, cybersecurity, and mobile app development. Which service interests you most?";
        }

        if (lowerMessage.includes('web development') || lowerMessage.includes('website')) {
            return "Our web development services include custom websites, web applications, e-commerce solutions, CMS integration, and API development. We use modern technologies to build fast, responsive, and scalable solutions. Would you like to discuss a specific project?";
        }

        if (lowerMessage.includes('digital marketing') || lowerMessage.includes('marketing')) {
            return "Our digital marketing services cover SEO optimization, social media marketing, content marketing, and PPC advertising. We help businesses increase their online presence and drive conversions. What's your marketing goal?";
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            return "Our pricing varies based on project scope and requirements. For a detailed quote, please contact us through the contact form or email us at info@webertron.com. We'd be happy to discuss your specific needs!";
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
            return "You can reach us at:\n📧 Email: info@webertron.com\n📞 Phone: +1 (555) 123-4567\n📍 Address: 123 Tech Street, Digital City, DC 12345\n\nOr fill out the contact form on our website!";
        }

        if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
            return "We've completed 500+ successful projects including e-commerce platforms, corporate websites, mobile apps, and digital marketing campaigns. Check out our Projects section to see some featured work!";
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm here to help you learn about our IT services. Feel free to ask about web development, digital marketing, or any other services we offer!";
        }

        if (lowerMessage.includes('help')) {
            return "I can help you with:\n• Information about our services\n• Project inquiries\n• Pricing information\n• Contact details\n• General questions about our company\n\nWhat would you like to know?";
        }

        // Default response
        return "That's an interesting question! I'm here to help you learn about our IT services. Could you tell me more about what you're looking for? I can provide information about our web development, digital marketing, or other services.";
    }

    // Render message
    renderMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.dataset.messageId = message.id;

        const time = this.formatTime(message.timestamp);

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${message.isUser ? 
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' :
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
                }
            </div>
            <div class="message-content">
                <p>${this.formatMessage(message.text)}</p>
                <span class="message-time">${time}</span>
                ${message.isUser ? `
                    <div class="message-actions">
                        <button class="message-action-btn edit-message" data-id="${message.id}">Edit</button>
                        <button class="message-action-btn delete-message" data-id="${message.id}">Delete</button>
                    </div>
                ` : ''}
            </div>
        `;

        chatMessages.appendChild(messageDiv);

        // Add event listeners for edit/delete
        if (message.isUser) {
            messageDiv.querySelector('.edit-message').addEventListener('click', (e) => {
                this.editMessage(message.id);
            });
            messageDiv.querySelector('.delete-message').addEventListener('click', (e) => {
                this.deleteMessageAndRender(message.id);
            });
        }

        this.scrollToBottom();
    }

    // Render all messages
    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        const messages = this.getMessages();
        if (messages.length === 0) {
            // Show welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'chat-message bot-message';
            welcomeMsg.innerHTML = `
                <div class="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="message-content">
                    <p>Hello! I'm your AI assistant. How can I help you today? I can answer questions about our services, help with projects, or assist with any inquiries.</p>
                    <span class="message-time">${this.formatTime(new Date())}</span>
                </div>
            `;
            chatMessages.appendChild(welcomeMsg);
        } else {
            messages.forEach(msg => this.renderMessage(msg));
        }
    }

    // Edit message
    editMessage(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (!message) return;

        const newText = prompt('Edit your message:', message.text);
        if (newText && newText.trim() && newText !== message.text) {
            this.updateMessage(messageId, newText.trim());
            this.renderMessages();
        }
    }

    // Delete message and re-render
    deleteMessageAndRender(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            this.deleteMessage(messageId);
            this.renderMessages();
        }
    }

    // Clear current chat
    clearCurrentChat() {
        if (confirm('Are you sure you want to clear this conversation?')) {
            if (this.currentConversationId) {
                this.deleteConversation(this.currentConversationId);
            }
            this.messages = [];
            this.renderMessages();
        }
    }

    // Update history panel
    updateHistoryPanel() {
        const historyList = document.getElementById('historyList');
        const conversations = this.getConversations();

        if (conversations.length === 0) {
            historyList.innerHTML = '<p class="no-history">No previous conversations</p>';
            return;
        }

        historyList.innerHTML = conversations.map(conv => {
            const isActive = conv.id === this.currentConversationId;
            const date = this.formatDate(conv.updatedAt);
            const convMessages = this.messages.filter(msg => msg.conversationId === conv.id);
            const firstUserMessage = convMessages.find(msg => msg.isUser);
            const preview = firstUserMessage 
                ? (firstUserMessage.text.length > 50 ? firstUserMessage.text.substring(0, 50) + '...' : firstUserMessage.text)
                : 'No messages yet';

            return `
                <div class="history-item ${isActive ? 'active' : ''}" data-id="${conv.id}">
                    <div class="history-item-header">
                        <span class="history-item-title">${conv.title}</span>
                        <span class="history-item-date">${date}</span>
                    </div>
                    <div class="history-item-preview">${preview}</div>
                    <div class="history-item-actions">
                        <button class="history-action-btn load-conversation" data-id="${conv.id}">Load</button>
                        <button class="history-action-btn delete-conversation" data-id="${conv.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        historyList.querySelectorAll('.load-conversation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.loadConversation(id);
                document.getElementById('chatHistoryPanel').classList.remove('active');
            });
        });

        historyList.querySelectorAll('.delete-conversation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                if (confirm('Are you sure you want to delete this conversation?')) {
                    this.deleteConversation(id);
                }
            });
        });
    }

    // Show typing indicator
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator-container';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // Remove typing indicator
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Format time
    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Format date
    formatDate(date) {
        const now = new Date();
        const msgDate = new Date(date);
        const diff = now - msgDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: msgDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }

    // Format message text (preserve line breaks)
    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }

    // Update all timestamps
    updateTimeStamps() {
        document.querySelectorAll('.message-time').forEach(el => {
            if (!el.textContent) {
                el.textContent = this.formatTime(new Date());
            }
        });
    }
}

// Initialize Chatbot
const chatbot = new ChatbotManager();
