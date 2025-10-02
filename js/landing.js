// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // CONFIGURATION AND INITIALIZATION
    // ========================================
    
    const config = {
        // UTM Parameters tracking
        utmParams: getUtmParameters(),
        
        // Form configuration
        form: {
            redirectUrl: 'gracias.html',
            webhook: '', // To be configured from admin panel
            emailEndpoint: '' // To be configured from admin panel
        },
        
        // Contact information (loaded dynamically)
        contact: {
            phone: '+1 (800) 123-4567',
            whatsapp: '+1 (800) 123-4567',
            email: 'admin@synapleads.com'
        }
    };
    
    // Initialize landing page functionality
    initializeLanding();
    
    // ========================================
    // MAIN INITIALIZATION FUNCTION
    // ========================================
    
    function initializeLanding() {
        loadContent();
        setupFormHandling();
        setupFAQAccordion();
        setupCTAButtons();
        setupSmoothScrolling();
        setupPhoneAndWhatsAppLinks();
        trackPageView();
    }
    
    // ========================================
    // CONTENT LOADING
    // ========================================
    
    async function loadContent() {
        try {
            // Load configuration
            const configResponse = await fetch('data/config.json');
            if (configResponse.ok) {
                const configData = await configResponse.json();
                Object.assign(config.contact, configData.contact);
                
                // Update contact information in DOM
                updateContactInfo(configData.contact);
                
                // Initialize tracking with loaded config
                if (configData.analytics) {
                    initializeAnalytics(configData.analytics);
                }
            }
            
            // Load landing-specific content
            const contentResponse = await fetch('data/landing-content.json');
            if (contentResponse.ok) {
                const contentData = await contentResponse.json();
                updateLandingContent(contentData);
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }
    
    function updateContactInfo(contact) {
        // Update phone numbers
        const phoneElements = document.querySelectorAll('#footer-phone, #cta-primary');
        phoneElements.forEach(el => {
            if (el.tagName === 'SPAN') {
                el.textContent = contact.phone;
            } else if (el.tagName === 'BUTTON') {
                el.innerHTML = `<i class="fas fa-phone"></i> ${contact.phone} (30 segundos)`;
            }
        });
        
        // Update WhatsApp
        const whatsappElements = document.querySelectorAll('#footer-whatsapp, #cta-whatsapp');
        whatsappElements.forEach(el => {
            if (el.tagName === 'SPAN') {
                el.textContent = 'WhatsApp';
            }
        });
        
        // Update email
        const emailElement = document.querySelector('#footer-email');
        if (emailElement) {
            emailElement.textContent = contact.email;
        }
    }
    
    function updateLandingContent(content) {
        // Update hero section
        if (content.hero) {
            const titleElement = document.querySelector('#hero-title');
            const descElement = document.querySelector('#hero-description');
            
            if (titleElement && content.hero.title) {
                titleElement.textContent = content.hero.title;
            }
            if (descElement && content.hero.description) {
                descElement.textContent = content.hero.description;
            }
        }
    }
    
    // ========================================
    // FORM HANDLING
    // ========================================
    
    function setupFormHandling() {
        const leadForm = document.querySelector('#leadForm');
        if (leadForm) {
            leadForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Real-time validation
        const inputs = leadForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Phone number formatting
        const phoneInput = document.querySelector('#telefono');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type=\"submit\"]');
        const originalText = submitButton.innerHTML;
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Enviando...';
        
        try {
            // Collect form data
            const formData = collectFormData(form);
            
            // Add UTM parameters
            Object.assign(formData, config.utmParams);
            
            // Add timestamp
            formData.timestamp = new Date().toISOString();
            formData.page = 'landing-seguros';
            
            // Track form submission
            trackEvent('form_submit', {
                form_name: 'lead_form',
                page: 'landing-seguros'
            });
            
            // Submit form data
            const success = await submitFormData(formData);
            
            if (success) {
                // Track conversion
                trackEvent('conversion', {
                    event_category: 'lead_generation',
                    event_label: 'seguros_gastos_finales'
                });
                
                // Store lead data in session for thank you page
                sessionStorage.setItem('leadData', JSON.stringify(formData));
                
                // Redirect to thank you page
                window.location.href = config.form.redirectUrl;
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormError('Ha ocurrido un error. Por favor, intenta nuevamente o llama directamente.');
            
            // Track error
            trackEvent('form_error', {
                error_message: error.message,
                page: 'landing-seguros'
            });
            
        } finally {
            // Restore button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
    
    function collectFormData(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else if (input.type === 'checkbox') {
                if (input.checked) {
                    formData[input.name] = true;
                }
            } else {
                formData[input.name] = input.value;
            }
        });
        
        return formData;
    }
    
    async function submitFormData(formData) {
        // Multiple submission methods for redundancy
        const promises = [];
        
        // Method 1: Webhook (if configured)
        if (config.form.webhook) {
            promises.push(
                fetch(config.form.webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
            );
        }
        
        // Method 2: Email endpoint (if configured)
        if (config.form.emailEndpoint) {
            promises.push(
                fetch(config.form.emailEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
            );
        }
        
        // Method 3: Local storage backup
        const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
        existingLeads.push(formData);
        localStorage.setItem('leads', JSON.stringify(existingLeads));
        
        try {
            if (promises.length > 0) {
                const results = await Promise.allSettled(promises);
                // Return true if at least one submission succeeded
                return results.some(result => result.status === 'fulfilled');
            }
            return true; // Local storage always works
        } catch (error) {
            console.error('Submission error:', error);
            return true; // Still count as success due to local storage
        }
    }
    
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(e) {
        const input = e.target;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous error
        clearFieldError({ target: input });
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        // Specific field validations
        if (value) {
            switch (input.type) {
                case 'email':
                    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un email válido';
                    }
                    break;
                case 'tel':
                    if (!/^[\\d\\s\\-\\(\\)\\+]{10,}$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un teléfono válido (mínimo 10 dígitos)';
                    }
                    break;
            }
        }
        
        if (!isValid) {
            showFieldError(input, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(e) {
        const input = e.target;
        input.classList.remove('error');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function showFormError(message) {
        // Create or update form error message
        let errorDiv = document.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            const form = document.querySelector('#leadForm');
            form.appendChild(errorDiv);
        }
        
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    function formatPhoneNumber(e) {
        let value = e.target.value.replace(/\\D/g, '');
        
        if (value.length >= 10) {
            if (value.length === 10) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            } else if (value.length === 11 && value[0] === '1') {
                value = `+1 (${value.slice(1,4)}) ${value.slice(4,7)}-${value.slice(7,11)}`;
            }
        }
        
        e.target.value = value;
    }
    
    // ========================================
    // FAQ ACCORDION
    // ========================================
    
    function setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-item__question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    
                    // Track FAQ interaction
                    trackEvent('faq_open', {
                        question: question.querySelector('h3').textContent,
                        page: 'landing-seguros'
                    });
                }
            });
        });
    }
    
    // ========================================
    // CTA BUTTONS
    // ========================================
    
    function setupCTAButtons() {
        // Primary CTA buttons (phone calls)
        const phoneCTAs = document.querySelectorAll('#cta-primary, #final-cta-phone');
        phoneCTAs.forEach(btn => {
            btn.addEventListener('click', () => {
                const phone = config.contact.phone.replace(/[^\\d]/g, '');
                window.location.href = `tel:+${phone}`;
                
                trackEvent('click_to_call', {
                    button_location: btn.id,
                    page: 'landing-seguros'
                });
            });
        });
        
        // WhatsApp CTA buttons
        const whatsappCTAs = document.querySelectorAll('#cta-whatsapp');
        whatsappCTAs.forEach(btn => {
            btn.addEventListener('click', () => {
                const phone = config.contact.whatsapp.replace(/[^\\d]/g, '');
                const message = encodeURIComponent('Hola, me interesa información sobre el seguro de gastos finales.');
                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                
                trackEvent('click_to_whatsapp', {
                    button_location: btn.id,
                    page: 'landing-seguros'
                });
            });
        });
        
        // Form CTA buttons
        const formCTAs = document.querySelectorAll('#final-cta-form');
        formCTAs.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('#leadForm').scrollIntoView({
                    behavior: 'smooth'
                });
                
                trackEvent('scroll_to_form', {
                    button_location: btn.id,
                    page: 'landing-seguros'
                });
            });
        });
    }
    
    function setupPhoneAndWhatsAppLinks() {
        // Update all phone links
        const phoneLinks = document.querySelectorAll('a[href^=\"tel:\"]');
        phoneLinks.forEach(link => {
            const phone = config.contact.phone.replace(/[^\\d]/g, '');
            link.href = `tel:+${phone}`;
        });
        
        // Update all WhatsApp links
        const whatsappLinks = document.querySelectorAll('a[href*=\"whatsapp\"], a[href*=\"wa.me\"]');
        whatsappLinks.forEach(link => {
            const phone = config.contact.whatsapp.replace(/[^\\d]/g, '');
            const message = encodeURIComponent('Hola, me interesa información sobre seguros.');
            link.href = `https://wa.me/${phone}?text=${message}`;
        });
    }
    
    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    
    function setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^=\"#\"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    trackEvent('navigation_click', {
                        target_section: targetId,
                        page: 'landing-seguros'
                    });
                }
            });
        });
    }
    
    // ========================================
    // ANALYTICS AND TRACKING
    // ========================================
    
    function initializeAnalytics(analyticsConfig) {
        // Google Analytics 4
        if (analyticsConfig.ga4_id) {
            window.gtag = window.gtag || function(){
                (window.gtag.q = window.gtag.q || []).push(arguments);
            };
            
            gtag('js', new Date());
            gtag('config', analyticsConfig.ga4_id, {
                page_title: 'Landing - Seguros de Gastos Finales',
                page_location: window.location.href
            });
        }
        
        // Meta Pixel
        if (analyticsConfig.meta_pixel_id) {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', analyticsConfig.meta_pixel_id);
            fbq('track', 'PageView');
        }
    }
    
    function trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Landing - Seguros de Gastos Finales',
                page_location: window.location.href,
                content_group1: 'Landing Pages'
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Seguros de Gastos Finales Landing',
                content_category: 'Insurance'
            });
        }
    }
    
    function trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Meta Pixel
        if (typeof fbq !== 'undefined') {
            switch(eventName) {
                case 'form_submit':
                    fbq('track', 'Lead');
                    break;
                case 'conversion':
                    fbq('track', 'CompleteRegistration');
                    break;
                case 'click_to_call':
                case 'click_to_whatsapp':
                    fbq('track', 'Contact');
                    break;
            }
        }
        
        console.log('Event tracked:', eventName, parameters);
    }
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    function getUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || '',
            referrer: document.referrer || '',
            landing_page: window.location.pathname
        };
    }
    
    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .faq-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Initialize animations after DOM is fully loaded
    setTimeout(setupScrollAnimations, 100);
    
});

// Export functions for admin panel integration
window.landingPageAPI = {
    updateContent: function(newContent) {
        // Function to update content dynamically
        console.log('Updating landing content:', newContent);
    },
    
    updateContact: function(newContact) {
        // Function to update contact information
        console.log('Updating contact info:', newContact);
    },
    
    getLeads: function() {
        // Function to retrieve stored leads
        return JSON.parse(localStorage.getItem('leads') || '[]');
    },
    
    clearLeads: function() {
        // Function to clear leads (for admin use)
        localStorage.removeItem('leads');
        return true;
    }
};