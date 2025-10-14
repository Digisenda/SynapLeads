/**
 * Landing Page JavaScript - Seguros de Gastos Finales
 * Incluye funcionalidad A2P 10DLC compliant
 */

class LandingPage {
    constructor() {
        this.contentData = null;
        this.formSubmitted = false;
        this.consentTextCapture = {};
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadContent();
            this.bindEvents();
            this.initializeForm();
            this.captureAnalyticsData();
            
            console.log('Landing page initialized successfully');
        } catch (error) {
            console.error('Error initializing landing page:', error);
        }
    }
    
    async loadContent() {
        try {
            const response = await fetch('data/landing-content.json');
            if (!response.ok) throw new Error('Failed to load content');
            
            this.contentData = await response.json();
            this.renderContent();
        } catch (error) {
            console.error('Error loading content:', error);
            this.loadFallbackContent();
        }
    }
    
    renderContent() {
        if (!this.contentData) return;
        
        // Hero section
        this.updateElement('hero-title', this.contentData.hero?.title);
        this.updateElement('hero-subtitle', this.contentData.hero?.subtitle);
        this.updateElement('badge-text', this.contentData.hero?.badge);
        
        // Benefits
        this.renderBenefits();
        
        // FAQ
        this.renderFAQ();
        
        // Testimonials
        this.renderTestimonials();
        
        // Form
        this.updateElement('form-title', this.contentData.form?.title);
        this.updateElement('form-subtitle', this.contentData.form?.subtitle);
    }
    
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element && content) {
            element.textContent = content;
        }
    }
    
    renderBenefits() {
        const benefitsGrid = document.getElementById('benefits-grid');
        if (!benefitsGrid || !this.contentData.benefits) return;
        
        benefitsGrid.innerHTML = this.contentData.benefits.map(benefit => `
            <div class="benefit-card fade-in">
                <div class="benefit-icon">
                    <i class="${benefit.icon || 'fas fa-check'}"></i>
                </div>
                <h3 class="benefit-title">${benefit.title}</h3>
                <p class="benefit-description">${benefit.description}</p>
                <span class="benefit-highlight">${benefit.highlight}</span>
            </div>
        `).join('');
    }
    
    renderFAQ() {
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer || !this.contentData.faq) return;
        
        faqContainer.innerHTML = this.contentData.faq.map((item, index) => `
            <div class="faq-item" data-faq="${index}">
                <div class="faq-question" onclick="window.landingPage.toggleFAQ(${index})">
                    <span>${item.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
    }
    
    renderTestimonials() {
        const testimonialsGrid = document.getElementById('testimonials-grid');
        if (!testimonialsGrid || !this.contentData.testimonials) return;
        
        testimonialsGrid.innerHTML = this.contentData.testimonials.map(testimonial => `
            <div class="testimonial-card fade-in">
                <div class="testimonial-quote">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.age} • ${testimonial.location} • Cobertura: ${testimonial.coverage}</p>
                    </div>
                    <div class="testimonial-rating">
                        ${Array(testimonial.rating || 5).fill().map(() => '<i class="fas fa-star"></i>').join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    bindEvents() {
        // Form submission
        const form = document.getElementById('leadForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
        
        // Real-time validation
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('telefono');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber);
        }
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Consent checkbox tracking
        const smsCheckbox = document.getElementById('sms_consent');
        const whatsappCheckbox = document.getElementById('whatsapp_consent');
        
        if (smsCheckbox) {
            smsCheckbox.addEventListener('change', () => this.trackConsentChange('sms', smsCheckbox.checked));
        }
        
        if (whatsappCheckbox) {
            whatsappCheckbox.addEventListener('change', () => this.trackConsentChange('whatsapp', whatsappCheckbox.checked));
        }
    }
    
    initializeForm() {
        // Capture consent text for audit purposes
        this.captureConsentTexts();
        
        // Populate hidden fields
        this.populateHiddenFields();
        
        // Set form validation messages
        this.setupFormValidation();
    }
    
    captureConsentTexts() {
        const smsLabel = document.querySelector('label[for="sms_consent"] .consent-text');
        const whatsappLabel = document.querySelector('label[for="whatsapp_consent"] .consent-text');
        
        if (smsLabel) {
            this.consentTextCapture.sms = smsLabel.textContent.trim();
            document.getElementById('sms_consent_text').value = this.consentTextCapture.sms;
        }
        
        if (whatsappLabel) {
            this.consentTextCapture.whatsapp = whatsappLabel.textContent.trim();
            document.getElementById('whatsapp_consent_text').value = this.consentTextCapture.whatsapp;
        }
    }
    
    populateHiddenFields() {
        // Current page URL
        document.getElementById('page_url').value = window.location.href;
        
        // UTM parameters
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('utm_source').value = urlParams.get('utm_source') || '';
        document.getElementById('utm_medium').value = urlParams.get('utm_medium') || '';
        document.getElementById('utm_campaign').value = urlParams.get('utm_campaign') || '';
        
        // Timestamp
        document.getElementById('timestamp').value = new Date().toISOString();
        
        // User agent
        document.getElementById('user_agent').value = navigator.userAgent;
        
        // Get user IP (would normally be done server-side)
        this.getUserIP();
    }
    
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            document.getElementById('user_ip').value = data.ip;
        } catch (error) {
            console.warn('Could not get user IP:', error);
            document.getElementById('user_ip').value = 'unavailable';
        }
    }
    
    setupFormValidation() {
        const form = document.getElementById('leadForm');
        if (form) {
            form.setAttribute('novalidate', 'true');
        }
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        // Specific field validation
        switch (fieldName) {
            case 'nombre':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                } else if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El nombre solo puede contener letras y espacios';
                }
                break;
                
            case 'telefono':
                const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$/;
                if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
                    isValid = false;
                    errorMessage = 'Ingresa un número de teléfono válido';
                }
                break;
                
            case 'estado':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'Selecciona tu estado';
                }
                break;
                
            case 'edad':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'Selecciona tu rango de edad';
                }
                break;
        }
        
        // Show/hide error message
        if (errorElement) {
            if (isValid) {
                errorElement.classList.remove('show');
                field.classList.remove('error');
            } else {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                field.classList.add('error');
            }
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }
    
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        e.target.value = value;
    }
    
    validateForm() {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleFormSubmission() {
        if (this.formSubmitted) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.showFormMessage('Por favor, corrige los errores antes de continuar.', 'error');
            return;
        }
        
        this.formSubmitted = true;
        
        // Show loading state
        this.setSubmitButtonLoading(true);
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Send to backend
            const success = await this.submitToBackend(formData);
            
            if (success) {
                // Track conversion
                this.trackConversion(formData);
                
                // Redirect to thank you page
                this.redirectToThankYou(formData);
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('Error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
            this.formSubmitted = false;
        } finally {
            this.setSubmitButtonLoading(false);
        }
    }
    
    collectFormData() {
        const form = document.getElementById('leadForm');
        const formData = new FormData(form);
        
        // Convert to object
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add consent status
        data.sms_consent_granted = document.getElementById('sms_consent').checked;
        data.whatsapp_consent_granted = document.getElementById('whatsapp_consent').checked;
        
        // Add consent text for audit
        data.sms_consent_text = this.consentTextCapture.sms || '';
        data.whatsapp_consent_text = this.consentTextCapture.whatsapp || '';
        
        // Update timestamp
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    async submitToBackend(formData) {
        try {
            // Simulate API call (replace with actual endpoint)
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                return true;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            // Fallback to localStorage for demo purposes
            console.warn('Backend not available, saving to localStorage:', error);
            this.saveToLocalStorage(formData);
            return true;
        }
    }
    
    saveToLocalStorage(formData) {
        try {
            const existingLeads = JSON.parse(localStorage.getItem('synapleads_leads') || '[]');
            existingLeads.push({
                ...formData,
                id: Date.now(),
                saved_at: new Date().toISOString()
            });
            localStorage.setItem('synapleads_leads', JSON.stringify(existingLeads));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    trackConversion(formData) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_form_submit', {
                event_category: 'lead_generation',
                event_label: 'seguros_gastos_finales',
                sms_consent: formData.sms_consent_granted,
                whatsapp_consent: formData.whatsapp_consent_granted,
                lead_source: formData.utm_source || 'direct',
                lead_medium: formData.utm_medium || 'website'
            });
        }
        
        // Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_category: 'seguros_gastos_finales',
                content_name: 'lead_form',
                sms_consent: formData.sms_consent_granted,
                whatsapp_consent: formData.whatsapp_consent_granted
            });
        }
        
        // Custom tracking
        console.log('Lead conversion tracked:', {
            timestamp: formData.timestamp,
            sms_consent: formData.sms_consent_granted,
            whatsapp_consent: formData.whatsapp_consent_granted,
            source: formData.utm_source
        });
    }
    
    redirectToThankYou(formData) {
        const params = new URLSearchParams({
            nombre: formData.nombre,
            telefono: formData.telefono,
            estado: formData.estado,
            timestamp: formData.timestamp,
            sms_consent: formData.sms_consent_granted,
            whatsapp_consent: formData.whatsapp_consent_granted
        });
        
        window.location.href = `gracias.html?${params.toString()}`;
    }
    
    trackConsentChange(type, granted) {
        const timestamp = new Date().toISOString();
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consent_change', {
                event_category: 'consent',
                event_label: type,
                consent_granted: granted,
                timestamp: timestamp
            });
        }
        
        console.log(`Consent ${type}:`, granted, 'at', timestamp);
    }
    
    toggleFAQ(index) {
        const faqItem = document.querySelector(`[data-faq="${index}"]`);
        if (!faqItem) return;
        
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't already active
        if (!isActive) {
            faqItem.classList.add('active');
            
            // Track FAQ interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_interaction', {
                    event_category: 'engagement',
                    event_label: `faq_${index}`,
                    faq_question: this.contentData.faq[index]?.question || 'unknown'
                });
            }
        }
    }
    
    setSubmitButtonLoading(loading) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }
    
    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-${type}`;
        messageDiv.textContent = message;
        
        // Insert before submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.parentNode.insertBefore(messageDiv, submitBtn);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    loadFallbackContent() {
        console.warn('Loading fallback content');
        
        // Set default content if JSON fails to load
        this.updateElement('hero-title', 'Seguros de Gastos Finales');
        this.updateElement('hero-subtitle', 'Protege a tu familia sin examen médico');
        this.updateElement('form-title', 'Solicita Tu Información');
        this.updateElement('form-subtitle', 'Contacto inmediato con agentes especializados');
    }
    
    captureAnalyticsData() {
        // Track page view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.startTimeTracking();
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                        trackedMilestones.add(milestone);
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll', {
                                event_category: 'engagement',
                                event_label: `${milestone}%`,
                                value: milestone
                            });
                        }
                    }
                });
            }
        });
    }
    
    startTimeTracking() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'page_engagement',
                    value: timeSpent
                });
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.landingPage = new LandingPage();
});

// Initialize content loader if available
if (typeof ContentLoader !== 'undefined') {
    ContentLoader.init();
}