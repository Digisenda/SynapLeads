/**
 * PÁGINA DE AGRADECIMIENTO - SYNAPLEADS
 * JavaScript para contador dinámico y funcionalidades post-conversión
 */

class ThanksPage {
    constructor() {
        this.countdown = {
            minutes: 5,
            seconds: 0,
            isRunning: false,
            intervalId: null
        };
        
        this.config = {
            estimatedContactTime: 5 * 60, // 5 minutes in seconds
            trackingEnabled: true,
            autoRedirectTime: 10 * 60 * 1000 // 10 minutes in milliseconds
        };
        
        this.init();
    }

    init() {
        this.displayUserInfo();
        this.loadConfigFromJSON();
        this.startCountdown();
        this.setupEventListeners();
        this.trackPageView();
        this.setupAutoRedirect();
    }

    /**
     * Load configuration from JSON file
     */
    async loadConfigFromJSON() {
        try {
            const response = await fetch('data/config.json');
            if (response.ok) {
                const config = await response.json();
                this.updateContactInfo(config);
                this.updateTrackingIDs(config);
            }
        } catch (error) {
            console.log('Config file not found, using defaults');
        }
    }

    /**
     * Update contact information from config
     */
    updateContactInfo(config) {
        if (config.contact) {
            // Update phone links
            const callBtn = document.getElementById('call-btn');
            const whatsappBtn = document.getElementById('whatsapp-btn');
            
            if (callBtn && config.contact.phone) {
                callBtn.href = `tel:${config.contact.phone}`;
            }
            
            if (whatsappBtn && config.contact.whatsapp) {
                whatsappBtn.href = `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`;
            }
        }
    }

    /**
     * Update tracking IDs from config
     */
    updateTrackingIDs(config) {
        if (config.analytics) {
            // Update GA4 tracking
            if (config.analytics.ga4_id && window.gtag) {
                gtag('config', config.analytics.ga4_id);
            }
            
            // Update Meta Pixel
            if (config.analytics.meta_pixel_id && window.fbq) {
                fbq('init', config.analytics.meta_pixel_id);
                fbq('track', 'PageView');
                fbq('track', 'Lead');
            }
        }
    }

    /**
     * Display user information from URL parameters or localStorage
     */
    displayUserInfo() {
        // Get data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Try localStorage first, then URL params
        const userData = {
            name: localStorage.getItem('lead_name') || urlParams.get('name') || 'Cliente',
            phone: localStorage.getItem('lead_phone') || urlParams.get('phone') || 'No proporcionado',
            state: localStorage.getItem('lead_state') || urlParams.get('state') || 'No especificado',
            age: localStorage.getItem('lead_age') || urlParams.get('age') || 'No especificado'
        };

        // Update display elements
        this.updateDisplayElement('display-name', userData.name);
        this.updateDisplayElement('display-phone', this.formatPhone(userData.phone));
        this.updateDisplayElement('display-state', userData.state);

        // Store for analytics
        this.userData = userData;
    }

    /**
     * Update display element with fallback
     */
    updateDisplayElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value || 'No proporcionado';
        }
    }

    /**
     * Format phone number for display
     */
    formatPhone(phone) {
        if (!phone || phone === 'No proporcionado') return phone;
        
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.substr(0, 3)}) ${cleaned.substr(3, 3)}-${cleaned.substr(6, 4)}`;
        }
        return phone;
    }

    /**
     * Start countdown timer
     */
    startCountdown() {
        if (this.countdown.isRunning) return;

        this.countdown.isRunning = true;
        this.updateCountdownDisplay();

        this.countdown.intervalId = setInterval(() => {
            if (this.countdown.seconds > 0) {
                this.countdown.seconds--;
            } else if (this.countdown.minutes > 0) {
                this.countdown.minutes--;
                this.countdown.seconds = 59;
            } else {
                this.stopCountdown();
                this.onCountdownComplete();
                return;
            }
            
            this.updateCountdownDisplay();
        }, 1000);

        // Track countdown start
        this.trackEvent('countdown_started', {
            estimated_time: this.config.estimatedContactTime
        });
    }

    /**
     * Stop countdown timer
     */
    stopCountdown() {
        if (this.countdown.intervalId) {
            clearInterval(this.countdown.intervalId);
            this.countdown.intervalId = null;
        }
        this.countdown.isRunning = false;
    }

    /**
     * Update countdown display
     */
    updateCountdownDisplay() {
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (minutesEl) {
            minutesEl.textContent = String(this.countdown.minutes).padStart(2, '0');
        }
        
        if (secondsEl) {
            secondsEl.textContent = String(this.countdown.seconds).padStart(2, '0');
        }
    }

    /**
     * Handle countdown completion
     */
    onCountdownComplete() {
        const countdownText = document.querySelector('.countdown-text');
        if (countdownText) {
            countdownText.innerHTML = '<strong>¡Su turno ha llegado! Un agente debe estar contactándolo ahora.</strong>';
            countdownText.style.color = 'var(--success-color)';
        }

        // Show notification if supported
        this.showNotification();

        // Track countdown completion
        this.trackEvent('countdown_completed', {
            user_data: this.userData
        });

        // Add visual indicator
        this.addCompletionIndicator();
    }

    /**
     * Add visual indicator when countdown completes
     */
    addCompletionIndicator() {
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.classList.add('countdown-complete');
            
            // Add CSS class for completion state
            const style = document.createElement('style');
            style.textContent = `
                .countdown-complete .countdown-display {
                    background: linear-gradient(135deg, var(--success-color), #059669) !important;
                    animation: completePulse 2s ease-in-out infinite;
                }
                @keyframes completePulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Show browser notification
     */
    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Synapleads - Hora de contacto', {
                body: 'Un agente debe estar contactándolo ahora. Por favor, mantenga su teléfono disponible.',
                icon: 'images/synapleads-logo.png'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Track contact button clicks
        const callBtn = document.getElementById('call-btn');
        const whatsappBtn = document.getElementById('whatsapp-btn');
        
        if (callBtn) {
            callBtn.addEventListener('click', () => {
                this.trackEvent('phone_call_initiated', {
                    source: 'thank_you_page',
                    user_data: this.userData
                });
            });
        }
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.trackEvent('whatsapp_initiated', {
                    source: 'thank_you_page',
                    user_data: this.userData
                });
            });
        }

        // Track step interactions
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.trackEvent('step_interaction', {
                    step_number: index + 1,
                    step_content: step.querySelector('h4')?.textContent
                });
            });
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.trackEvent('page_focus', {
                    countdown_remaining: this.countdown.minutes * 60 + this.countdown.seconds
                });
            } else {
                this.trackEvent('page_blur', {
                    countdown_remaining: this.countdown.minutes * 60 + this.countdown.seconds
                });
            }
        });

        // Track scroll behavior
        let scrolled25 = false, scrolled50 = false, scrolled75 = false;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent >= 25 && !scrolled25) {
                scrolled25 = true;
                this.trackEvent('scroll_25_percent');
            }
            if (scrollPercent >= 50 && !scrolled50) {
                scrolled50 = true;
                this.trackEvent('scroll_50_percent');
            }
            if (scrollPercent >= 75 && !scrolled75) {
                scrolled75 = true;
                this.trackEvent('scroll_75_percent');
            }
        });
    }

    /**
     * Setup auto-redirect functionality
     */
    setupAutoRedirect() {
        // Auto-redirect after specified time
        setTimeout(() => {
            if (confirm('¿Desea volver a la página principal?')) {
                this.trackEvent('auto_redirect_accepted');
                window.location.href = 'index.html';
            } else {
                this.trackEvent('auto_redirect_declined');
            }
        }, this.config.autoRedirectTime);
    }

    /**
     * Track page view and conversion
     */
    trackPageView() {
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: 'Thank You Page',
                page_location: window.location.href,
                custom_parameters: {
                    user_name: this.userData?.name || 'unknown',
                    user_state: this.userData?.state || 'unknown',
                    conversion_type: 'lead_form_submission'
                }
            });

            // Track conversion
            gtag('event', 'conversion', {
                send_to: 'GA_MEASUREMENT_ID/CONVERSION_ID',
                value: 1.0,
                currency: 'USD',
                custom_parameters: {
                    lead_quality: 'high',
                    source_page: document.referrer || 'direct'
                }
            });
        }

        // Meta Pixel
        if (window.fbq) {
            fbq('track', 'Lead', {
                content_name: 'Insurance Lead Form',
                content_category: 'Final Expense Insurance',
                value: 50.0,
                currency: 'USD',
                custom_data: {
                    user_state: this.userData?.state,
                    age_range: this.userData?.age
                }
            });
        }

        // Custom tracking
        this.trackEvent('thank_you_page_loaded', {
            user_data: this.userData,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.config.trackingEnabled) return;

        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'thank_you_page',
                event_label: eventName,
                custom_parameters: parameters
            });
        }

        // Console log for debugging
        console.log(`Event tracked: ${eventName}`, parameters);

        // Store in localStorage for potential later use
        try {
            const events = JSON.parse(localStorage.getItem('synapleads_events') || '[]');
            events.push({
                event: eventName,
                parameters,
                timestamp: new Date().toISOString(),
                page: 'thank_you'
            });
            
            // Keep only last 50 events
            if (events.length > 50) {
                events.splice(0, events.length - 50);
            }
            
            localStorage.setItem('synapleads_events', JSON.stringify(events));
        } catch (error) {
            console.log('Could not store event in localStorage:', error);
        }
    }

    /**
     * Get page statistics
     */
    getPageStats() {
        return {
            countdownRemaining: this.countdown.minutes * 60 + this.countdown.seconds,
            isCountdownRunning: this.countdown.isRunning,
            userData: this.userData,
            pageLoadTime: Date.now() - this.startTime,
            config: this.config
        };
    }
}

// Initialize the thank you page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thanksPage = new ThanksPage();
    
    // Request notification permission early
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission();
        }, 3000); // Request after 3 seconds
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.thanksPage) {
        window.thanksPage.trackEvent('page_unload', {
            time_on_page: Date.now() - (window.thanksPage.startTime || Date.now()),
            countdown_remaining: window.thanksPage.countdown.minutes * 60 + window.thanksPage.countdown.seconds
        });
    }
});

// Export for potential external use
window.SynapleadsThanksPage = ThanksPage;