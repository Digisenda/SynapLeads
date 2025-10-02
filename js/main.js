/**
 * JavaScript principal del sitio web
 * Funcionalidades globales y navegación
 */

class SynapleadsMain {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupTrackingPixels();
        this.setupFormValidation();
        this.setupAnalytics();
    }

    /**
     * Configurar navegación móvil
     */
    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navList = document.querySelector('.nav-list');
        
        if (hamburger && navList) {
            hamburger.addEventListener('click', () => {
                navList.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Cerrar menú al hacer click en un enlace
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
                    navList.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }

        // Header scroll effect
        this.setupHeaderScroll();
    }

    /**
     * Efecto de scroll en el header
     */
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'var(--color-white)';
                header.style.backdropFilter = 'none';
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * Configurar smooth scrolling
     */
    setupSmoothScrolling() {
        const anchorsLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorsLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Configurar pixels de tracking (GA4, Meta Pixel)
     */
    async setupTrackingPixels() {
        try {
            const config = await window.contentLoader?.loadJSON('config');
            if (!config || !config.tracking || !config.tracking.enable_tracking) return;

            // Google Analytics 4
            if (config.tracking.ga4_id) {
                this.loadGA4(config.tracking.ga4_id);
            }

            // Meta Pixel
            if (config.tracking.meta_pixel_id) {
                this.loadMetaPixel(config.tracking.meta_pixel_id);
            }
        } catch (error) {
            console.error('Error cargando tracking pixels:', error);
        }
    }

    /**
     * Cargar Google Analytics 4
     */
    loadGA4(ga4Id) {
        // Crear script de GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(script);

        // Configurar GA4
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', ga4Id);

        console.log('Google Analytics 4 cargado:', ga4Id);
    }

    /**
     * Cargar Meta Pixel
     */
    loadMetaPixel(pixelId) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', pixelId);
        fbq('track', 'PageView');

        console.log('Meta Pixel cargado:', pixelId);
    }

    /**
     * Configurar validación de formularios
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Validación en tiempo real
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    /**
     * Validar formulario completo
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Validar consentimiento si existe
        const consentCheckbox = form.querySelector('input[name="consent"]');
        if (consentCheckbox && !consentCheckbox.checked) {
            this.showFieldError(consentCheckbox, 'Debes aceptar los términos para continuar');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validar campo individual
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;

        // Limpiar errores previos
        this.clearFieldError(field);

        // Validación de campos requeridos
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo es obligatorio');
            return false;
        }

        // Validaciones específicas por tipo
        switch (fieldType) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Por favor ingresa un email válido');
                    return false;
                }
                break;

            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Por favor ingresa un número de teléfono válido');
                    return false;
                }
                break;
        }

        // Validaciones específicas por nombre de campo
        if (fieldName === 'telefono' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Por favor ingresa un número de teléfono válido');
            return false;
        }

        return true;
    }

    /**
     * Mostrar error de campo
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remover mensaje de error previo
        const prevError = field.parentElement.querySelector('.field-error');
        if (prevError) {
            prevError.remove();
        }

        // Crear mensaje de error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--color-accent)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';

        field.parentElement.appendChild(errorElement);
    }

    /**
     * Limpiar error de campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Validar email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validar teléfono
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    /**
     * Configurar analytics personalizados
     */
    setupAnalytics() {
        // Track clicks en CTAs
        const ctaButtons = document.querySelectorAll('.btn, .nav-cta');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('cta_click', {
                    'button_text': button.textContent,
                    'button_location': this.getButtonLocation(button)
                });
            });
        });

        // Track clicks en teléfono y WhatsApp
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('phone_click', {
                    'phone_number': link.href.replace('tel:', '')
                });
            });
        });

        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('whatsapp_click', {
                    'whatsapp_url': link.href
                });
            });
        });
    }

    /**
     * Enviar evento de analytics
     */
    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }

        // Meta Pixel
        if (window.fbq) {
            window.fbq('track', 'CustomEvent', {
                event_name: eventName,
                ...parameters
            });
        }

        console.log('Evento tracked:', eventName, parameters);
    }

    /**
     * Obtener ubicación del botón para analytics
     */
    getButtonLocation(button) {
        const section = button.closest('section');
        if (section) {
            const sectionClass = section.className;
            if (sectionClass.includes('hero')) return 'hero';
            if (sectionClass.includes('cta')) return 'cta_section';
            if (sectionClass.includes('contact')) return 'contact';
        }
        return 'unknown';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.synapleadsMain = new SynapleadsMain();
});

// Utilidades globales
window.SynapleadsUtils = {
    // Formatear número de teléfono
    formatPhone: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    // Obtener parámetros UTM
    getURLParams: function() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content')
        };
    },

    // Guardar parámetros UTM en localStorage
    saveUTMParams: function() {
        const utmParams = this.getURLParams();
        if (Object.values(utmParams).some(val => val !== null)) {
            localStorage.setItem('utm_params', JSON.stringify(utmParams));
        }
    }
};

// Guardar parámetros UTM al cargar la página
window.SynapleadsUtils.saveUTMParams();