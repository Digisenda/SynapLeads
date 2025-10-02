/**
 * JavaScript específico para la página de inicio
 * Carga contenido dinámico desde home-content.json
 */

class HomePage {
    constructor() {
        this.contentLoader = window.contentLoader;
        this.init();
    }

    async init() {
        // Esperar a que el contentLoader esté listo
        if (!this.contentLoader) {
            document.addEventListener('contentLoaded', () => {
                this.loadContent();
            });
        } else {
            await this.loadContent();
        }
    }

    async loadContent() {
        try {
            const homeContent = await this.contentLoader.loadJSON('home-content');
            const config = await this.contentLoader.loadJSON('config');
            
            if (homeContent) {
                this.loadHeroContent(homeContent.hero, config);
                this.loadServices(homeContent.services);
                this.loadTestimonials(homeContent.testimonials);
                this.loadCTASection(homeContent.cta_section);
            }

            if (config) {
                this.loadContactInfo(config.contact);
            }
        } catch (error) {
            console.error('Error cargando contenido de la página de inicio:', error);
        }
    }

    loadHeroContent(heroData, config) {
        if (!heroData) return;

        // Actualizar textos del hero
        this.contentLoader.setContent('#hero-title', heroData.title);
        this.contentLoader.setContent('#hero-subtitle', heroData.subtitle);
        
        // Actualizar CTAs
        const heroCTA = document.querySelector('#hero-cta');
        if (heroCTA && heroData.cta_text) {
            heroCTA.textContent = heroData.cta_text;
            if (heroData.cta_url) {
                heroCTA.href = heroData.cta_url;
            }
        }

        // Actualizar teléfono si está disponible en config
        if (config && config.contact && config.contact.phone) {
            const phoneBtn = document.querySelector('#hero-phone');
            if (phoneBtn) {
                phoneBtn.href = `tel:${config.contact.phone}`;
            }
        }
    }

    loadServices(servicesData) {
        if (!servicesData || !servicesData.items) return;

        // Actualizar títulos de la sección
        this.contentLoader.setContent('#services-title', servicesData.title);
        this.contentLoader.setContent('#services-subtitle', servicesData.subtitle);

        // Generar HTML para los servicios
        const servicesGrid = document.querySelector('#services-grid');
        if (servicesGrid) {
            const servicesHTML = servicesData.items.map(service => `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h3 class="service-title">${service.title}</h3>
                    <p class="service-description">${service.description}</p>
                </div>
            `).join('');

            servicesGrid.innerHTML = servicesHTML;
        }
    }

    loadTestimonials(testimonialsData) {
        if (!testimonialsData || !testimonialsData.items) return;

        // Actualizar título de la sección
        this.contentLoader.setContent('#testimonials-title', testimonialsData.title);

        // Generar HTML para los testimonios
        const testimonialsContainer = document.querySelector('#testimonials-container');
        if (testimonialsContainer) {
            const testimonialsHTML = testimonialsData.items.map(testimonial => `
                <div class="testimonial-card" style="background: var(--color-white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--box-shadow); text-align: center; max-width: 600px; margin: 0 auto;">
                    <div class="testimonial-content" style="margin-bottom: 1.5rem;">
                        <p style="font-style: italic; font-size: 1.1rem; color: var(--color-gray-dark); line-height: 1.6;">"${testimonial.text}"</p>
                    </div>
                    <div class="testimonial-author" style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                        ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.author}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">` : ''}
                        <div>
                            <div style="font-weight: 600; color: var(--color-primary);">${testimonial.author}</div>
                            <div style="color: var(--color-gray-dark); font-size: 0.9rem;">${testimonial.position}</div>
                        </div>
                    </div>
                </div>
            `).join('');

            testimonialsContainer.innerHTML = testimonialsHTML;
        }
    }

    loadCTASection(ctaData) {
        if (!ctaData) return;

        // Actualizar contenido de la sección CTA
        this.contentLoader.setContent('#cta-title', ctaData.title);
        this.contentLoader.setContent('#cta-subtitle', ctaData.subtitle);
        
        const ctaButton = document.querySelector('#cta-button');
        if (ctaButton) {
            ctaButton.textContent = ctaData.cta_text;
            if (ctaData.cta_url) {
                ctaButton.href = ctaData.cta_url;
            }
        }
    }

    loadContactInfo(contactData) {
        if (!contactData) return;

        // Actualizar información de contacto
        const contactPhone = document.querySelector('#contact-phone');
        if (contactPhone && contactData.phone) {
            contactPhone.textContent = contactData.phone;
            contactPhone.href = `tel:${contactData.phone}`;
        }

        const contactWhatsApp = document.querySelector('#contact-whatsapp');
        if (contactWhatsApp && contactData.whatsapp) {
            // Limpiar número para WhatsApp (remover caracteres especiales)
            const cleanPhone = contactData.whatsapp.replace(/[^\d]/g, '');
            contactWhatsApp.href = `https://wa.me/${cleanPhone}`;
        }

        const contactEmail = document.querySelector('#contact-email');
        if (contactEmail && contactData.email) {
            contactEmail.textContent = contactData.email;
            contactEmail.href = `mailto:${contactData.email}`;
        }

        // Footer contacts
        const footerPhone = document.querySelector('#footer-phone');
        if (footerPhone && contactData.phone) {
            footerPhone.textContent = contactData.phone;
        }

        const footerEmail = document.querySelector('#footer-email');
        if (footerEmail && contactData.email) {
            footerEmail.textContent = contactData.email;
        }

        const footerAddress = document.querySelector('#footer-address');
        if (footerAddress && contactData.address) {
            footerAddress.textContent = contactData.address;
        }
    }
}

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
});