// Modern Astronomy Picture App - Component-based Architecture
// Using modern vanilla JavaScript with React-like patterns

// State Management System
class AppState {
    constructor() {
        this.state = {
            loading: false,
            error: null,
            currentPicture: null,
            selectedDate: new Date().toISOString().split('T')[0]
        };
        this.subscribers = [];
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    getState() {
        return { ...this.state };
    }
}

// API Service - Clean separation of concerns
class AstronomyAPIService {
    constructor(config) {
        this.config = config;
    }

    async fetchPictureData(date) {
        try {
            const url = this.buildApiUrl(date);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw await this.handleApiError(response);
            }

            const rawData = await response.json();
            return this.transformResponse(rawData);
        } catch (error) {
            console.error('API Service Error:', error);
            throw error;
        }
    }

    async handleApiError(response) {
        const errorMessages = {
            429: 'Rate limit exceeded. Get your free NASA API key at: https://api.nasa.gov/',
            403: 'API access forbidden. Please check your API key in config.js',
            404: 'Picture not found for the selected date',
            500: 'API server error. Please try again later'
        };
        
        const message = errorMessages[response.status] || 
                       `API request failed: ${response.status} ${response.statusText}`;
        return new Error(message);
    }

    buildApiUrl(date) {
        const params = new URLSearchParams({
            [this.config.dateParam]: date,
            [this.config.apiKeyParam]: this.config.apiKey
        });
        return `${this.config.baseUrl}?${params.toString()}`;
    }

    transformResponse(data) {
        const mapping = this.config.responseMapping;
        if (!mapping) return data;

        return {
            title: data[mapping.title] || data.title,
            date: data[mapping.date] || data.date,
            explanation: data[mapping.explanation] || data.explanation,
            url: data[mapping.url] || data.url,
            hdurl: data[mapping.hdurl] || data.hdurl,
            media_type: data[mapping.mediaType] || data.media_type || 'image',
            copyright: data[mapping.copyright] || data.copyright
        };
    }

    static createDemoSample() {
        return {
            title: "The Horsehead Nebula (Demo Sample)",
            date: new Date().toISOString().split('T')[0],
            explanation: "This is a demo sample showing your futuristic astronomy app. The Horsehead Nebula is a dark nebula in the constellation Orion. Get your free NASA API key to see real daily astronomy pictures!",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Horsehead_Nebula_0.jpg/512px-Horsehead_Nebula_0.jpg",
            hdurl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Horsehead_Nebula_0.jpg",
            media_type: "image",
            copyright: "Demo Image from Wikimedia Commons"
        };
    }
}

// Component Base Class - React-like component system
class Component {
    constructor(element, state) {
        this.element = element;
        this.state = state;
        this.state.subscribe(this.render.bind(this));
    }

    render(state) {
        // Override in subclasses
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    addClass(className) {
        this.element.classList.add(className);
    }

    removeClass(className) {
        this.element.classList.remove(className);
    }
}

// Loading Component
class LoadingComponent extends Component {
    constructor(element, state) {
        super(element, state);
    }

    render(state) {
        if (state.loading) {
            this.show();
            this.addClass('animate-in');
        } else {
            this.hide();
            this.removeClass('animate-in');
        }
    }
}

// Error Component
class ErrorComponent extends Component {
    constructor(element, messageElement, state) {
        super(element, state);
        this.messageElement = messageElement;
    }

    render(state) {
        if (state.error) {
            this.showError(state.error);
        } else {
            this.hide();
        }
    }

    showError(error) {
        this.messageElement.innerHTML = error.replace(/\n/g, '<br>');
        this.show();
        
        if (error.includes('Rate limit exceeded')) {
            this.addRetryButton();
        }
    }

    addRetryButton() {
        const existingBtn = this.element.querySelector('#retry-btn');
        if (existingBtn) existingBtn.remove();
        
        const retryBtn = this.createRetryButton();
        this.element.appendChild(retryBtn);
    }

    createRetryButton() {
        const button = document.createElement('button');
        button.id = 'retry-btn';
        button.innerHTML = '<span class="btn-icon">🔬</span><span>Try Demo Sample</span>';
        button.className = 'glass-btn primary demo-btn';
        
        button.addEventListener('click', () => {
            const demoData = AstronomyAPIService.createDemoSample();
            this.state.setState({ error: null, currentPicture: demoData });
        });
        
        return button;
    }
}

// Media Component
class MediaComponent extends Component {
    constructor(element, state) {
        super(element, state);
    }

    render(state) {
        if (state.currentPicture) {
            this.displayMedia(state.currentPicture);
        }
    }

    displayMedia(data) {
        this.element.innerHTML = '';
        
        const mediaElement = this.createMediaElement(data);
        this.element.appendChild(mediaElement);
        
        // Add entrance animation
        requestAnimationFrame(() => {
            mediaElement.classList.add('fade-in');
        });
    }

    createMediaElement(data) {
        const isVideo = data.media_type === 'video' || 
                       data.url.includes('youtube.com') || 
                       data.url.includes('vimeo.com');
        
        if (isVideo) {
            return this.createVideoElement(data);
        } else {
            return this.createImageElement(data);
        }
    }

    createVideoElement(data) {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.alt = data.title || 'Astronomy video';
        iframe.className = 'media-element';
        return iframe;
    }

    createImageElement(data) {
        const img = document.createElement('img');
        img.src = data.hdurl || data.url;
        img.alt = data.title || 'Astronomy picture';
        img.className = 'media-element';
        
        if (data.hdurl && data.hdurl !== data.url) {
            img.style.cursor = 'pointer';
            img.title = 'Click to view high resolution image';
            img.addEventListener('click', () => this.openHighResImage(data.hdurl));
        }
        
        img.addEventListener('error', () => {
            img.src = data.url;
        });
        
        return img;
    }

    openHighResImage(url) {
        window.open(url, '_blank');
    }
}

// Info Component
class InfoComponent extends Component {
    constructor(elements, state) {
        super(elements.container, state);
        this.elements = elements;
    }

    render(state) {
        if (state.currentPicture) {
            this.displayInfo(state.currentPicture);
            this.show();
        } else {
            this.hide();
        }
    }

    displayInfo(data) {
        this.elements.title.textContent = data.title || 'Untitled';
        this.elements.date.textContent = this.formatDate(data.date);
        this.elements.explanation.textContent = data.explanation || 'No description available.';
        
        if (data.copyright) {
            this.elements.creditText.textContent = data.copyright;
            this.elements.credit.style.display = 'block';
        } else {
            this.elements.credit.style.display = 'none';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Controls Component
class ControlsComponent extends Component {
    constructor(elements, state, apiService) {
        super(elements.container, state);
        this.elements = elements;
        this.apiService = apiService;
        this.setupControls();
    }

    setupControls() {
        this.setupDateInput();
        this.bindEvents();
    }

    setupDateInput() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.dateInput.max = today;
        this.elements.dateInput.value = today;
    }

    bindEvents() {
        this.elements.fetchBtn.addEventListener('click', () => this.handleFetchClick());
        this.elements.todayBtn.addEventListener('click', () => this.handleTodayClick());
        this.elements.dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleFetchClick();
        });
    }

    async handleFetchClick() {
        const selectedDate = this.elements.dateInput.value;
        if (selectedDate) {
            await this.loadPicture(selectedDate);
        }
    }

    async handleTodayClick() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.dateInput.value = today;
        await this.loadPicture(today);
    }

    async loadPicture(date) {
        try {
            this.state.setState({ loading: true, error: null });
            const data = await this.apiService.fetchPictureData(date);
            this.state.setState({ 
                loading: false, 
                currentPicture: data,
                selectedDate: date 
            });
        } catch (error) {
            this.state.setState({ 
                loading: false, 
                error: error.message 
            });
        }
    }

    render(state) {
        // Controls don't need to re-render based on state changes
        // They just handle user interactions
    }
}

// Main Application Class - Modern Architecture
class AstronomyPictureApp {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Initialize state management
            this.state = new AppState();
            
            // Load API configuration
            this.apiConfig = this.loadApiConfig();
            this.apiService = new AstronomyAPIService(this.apiConfig);
            
            // Get DOM elements
            this.elements = this.getDOMElements();
            
            // Initialize components
            this.initializeComponents();
            
            // Load today's picture
            await this.loadTodaysPicture();
            
            console.log('🚀 Futuristic Astronomy App initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitializationError(error);
        }
    }

    loadApiConfig() {
        const defaultConfig = {
            baseUrl: 'https://api.nasa.gov/planetary/apod',
            apiKey: 'DEMO_KEY',
            dateParam: 'date',
            apiKeyParam: 'api_key',
            responseMapping: {
                title: 'title',
                date: 'date',
                explanation: 'explanation',
                url: 'url',
                hdurl: 'hdurl',
                mediaType: 'media_type',
                copyright: 'copyright'
            }
        };

        try {
            if (typeof API_CONFIGS !== 'undefined' && typeof ACTIVE_API !== 'undefined') {
                return { ...defaultConfig, ...API_CONFIGS[ACTIVE_API] };
            }
        } catch (error) {
            console.warn('⚠️ Could not load API config, using default:', error);
        }
        
        return defaultConfig;
    }

    getDOMElements() {
        const elements = {
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            errorMessage: document.getElementById('error-message'),
            content: document.getElementById('content'),
            dateInput: document.getElementById('date-input'),
            fetchBtn: document.getElementById('fetch-btn'),
            todayBtn: document.getElementById('today-btn'),
            mediaWrapper: document.getElementById('media-wrapper'),
            title: document.getElementById('picture-title'),
            date: document.getElementById('picture-date'),
            explanation: document.getElementById('picture-explanation'),
            credit: document.getElementById('picture-credit'),
            creditText: document.getElementById('credit-text')
        };

        // Validate all elements exist
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`Missing DOM elements: ${missingElements.join(', ')}`);
        }

        return elements;
    }

    initializeComponents() {
        // Initialize all components with clean separation
        this.components = {
            loading: new LoadingComponent(this.elements.loading, this.state),
            error: new ErrorComponent(this.elements.error, this.elements.errorMessage, this.state),
            media: new MediaComponent(this.elements.mediaWrapper, this.state),
            info: new InfoComponent({
                container: this.elements.content,
                title: this.elements.title,
                date: this.elements.date,
                explanation: this.elements.explanation,
                credit: this.elements.credit,
                creditText: this.elements.creditText
            }, this.state),
            controls: new ControlsComponent({
                container: null, // Controls don't have a single container
                dateInput: this.elements.dateInput,
                fetchBtn: this.elements.fetchBtn,
                todayBtn: this.elements.todayBtn
            }, this.state, this.apiService)
        };

        console.log('🎨 All components initialized with glassmorphism design!');
    }

    async loadTodaysPicture() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.dateInput.value = today;
        await this.components.controls.loadPicture(today);
    }

    handleInitializationError(error) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: var(--cosmic-dark);
                color: white;
                font-family: Inter, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div class="glass-panel" style="
                    padding: 40px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">
                    <h1>🚨 App Initialization Failed</h1>
                    <p style="margin: 20px 0; opacity: 0.8;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Reload App</button>
                </div>
            </div>
        `;
    }

    // Public API for external access
    getState() {
        return this.state.getState();
    }

    updateApiConfig(newConfig) {
        this.apiConfig = { ...this.apiConfig, ...newConfig };
        this.apiService = new AstronomyAPIService(this.apiConfig);
        console.log('🔧 API configuration updated!');
    }
}

// Modern App Initialization with Error Handling
class AppInitializer {
    static async initialize() {
        try {
            // Wait for DOM to be ready
            await AppInitializer.waitForDOM();
            
            // Add CSS animations for components
            AppInitializer.addAnimationStyles();
            
            // Initialize the main app
            const app = new AstronomyPictureApp();
            
            // Make available globally for debugging
            window.astronomyApp = app;
            
            // Add development helpers
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                AppInitializer.addDevelopmentHelpers(app);
            }
            
        } catch (error) {
            console.error('💥 Critical initialization error:', error);
        }
    }

    static waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    static addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            .fade-in {
                animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            .demo-btn {
                margin-top: 15px !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .media-element {
                opacity: 0;
                transform: scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .media-element.fade-in {
                opacity: 1;
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    static addDevelopmentHelpers(app) {
        console.log(`
🌌 Futuristic Astronomy Picture App - Developer Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 Available Commands:
  astronomyApp.getState()           - Get current app state
  astronomyApp.updateApiConfig({})  - Update API configuration
  
🎨 Features:
  ✅ Component-based architecture
  ✅ Reactive state management
  ✅ Modern glassmorphism design
  ✅ Smooth animations
  ✅ Error handling with fallbacks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }
}

// Initialize the app
AppInitializer.initialize();

// Utility Functions for Modern Development
const AppUtils = {
    // Enhanced logging with emojis
    log: {
        info: (message) => console.log(`ℹ️ ${message}`),
        success: (message) => console.log(`✅ ${message}`),
        warning: (message) => console.warn(`⚠️ ${message}`),
        error: (message) => console.error(`❌ ${message}`)
    },

    // Performance monitoring
    performanceMonitor: {
        start: (label) => console.time(`🚀 ${label}`),
        end: (label) => console.timeEnd(`🚀 ${label}`)
    },

    // Modern date formatting utilities
    dateUtils: {
        formatRelative: (dateString) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            return date.toLocaleDateString();
        },
        
        isValidDate: (dateString) => {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        }
    },

    // Enhanced error handling
    errorHandler: {
        wrap: (fn) => {
            return async (...args) => {
                try {
                    return await fn(...args);
                } catch (error) {
                    AppUtils.log.error(`Function ${fn.name} failed: ${error.message}`);
                    throw error;
                }
            };
        }
    },

    // API response validation
    validateApiResponse: (response, requiredFields = ['title', 'url']) => {
        const missing = requiredFields.filter(field => !response[field]);
        if (missing.length > 0) {
            throw new Error(`Invalid API response: missing fields ${missing.join(', ')}`);
        }
        return true;
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AstronomyPictureApp,
        AppState,
        AstronomyAPIService,
        Component,
        AppUtils
    };
}

// Modern browser feature detection
const FeatureDetection = {
    hasBackdropFilter: () => {
        return CSS.supports('backdrop-filter', 'blur(1px)') || 
               CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    },
    
    hasCustomProperties: () => {
        return window.CSS && CSS.supports('color', 'var(--fake-var)');
    },
    
    init: () => {
        if (!FeatureDetection.hasBackdropFilter()) {
            AppUtils.log.warning('Backdrop filter not supported, using fallback styles');
            document.body.classList.add('no-backdrop-filter');
        }
        
        if (!FeatureDetection.hasCustomProperties()) {
            AppUtils.log.warning('CSS custom properties not supported');
        }
    }
};

// Initialize feature detection
FeatureDetection.init();