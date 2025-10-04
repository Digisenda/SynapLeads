/**
 * LEGAL PAGES FUNCTIONALITY - SYNAPLEADS
 * Handles dynamic content loading and navigation for legal pages
 */

class LegalPageManager {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.content = null;
        this.config = null;
        this.init();
    }

    /**
     * Detect current page type from URL
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('privacidad')) return 'privacy';
        if (path.includes('terminos')) return 'terms';
        return 'privacy'; // default
    }

    /**
     * Initialize the legal page functionality
     */
    async init() {
        try {
            await this.loadContent();
            this.renderContent();
            this.setupNavigation();
            this.setupAnalytics();
            this.setupScrollSpy();
            this.addReadingProgress();
            console.log(`✅ Legal page (${this.currentPage}) initialized successfully`);
        } catch (error) {
            console.error('❌ Error initializing legal page:', error);
            this.handleError(error);
        }
    }

    /**
     * Load legal content from JSON
     */
    async loadContent() {
        try {
            const response = await fetch('data/legal-content.json');
            if (!response.ok) {
                throw new Error(`Failed to load legal content: ${response.status}`);
            }
            
            const data = await response.json();
            this.content = this.currentPage === 'privacy' ? data.privacy : data.terms;
            this.config = data.config;
            
        } catch (error) {
            console.error('Error loading legal content:', error);
            throw error;
        }
    }

    /**
     * Render the legal content dynamically
     */
    renderContent() {
        if (!this.content) return;

        // Update page title and meta
        this.updatePageMeta();
        
        // Render main content sections
        this.renderSections();
        
        // Generate navigation
        this.generateNavigation();
        
        // Update contact information
        this.updateContactInfo();
    }

    /**
     * Update page metadata
     */
    updatePageMeta() {
        const titleElement = document.getElementById('legal-title');
        const updatedElement = document.getElementById('legal-updated');
        
        if (titleElement) {
            titleElement.textContent = this.content.title;
        }
        
        if (updatedElement) {
            updatedElement.textContent = this.content.lastUpdated;
        }

        // Update document title
        document.title = `${this.content.title} - Synapleads`;
    }

    /**
     * Render content sections
     */
    renderSections() {
        const sectionsContainer = document.getElementById('legal-sections');
        if (!sectionsContainer || !this.content.sections) return;

        sectionsContainer.innerHTML = '';
        
        this.content.sections.forEach((section, index) => {
            const sectionElement = this.createSectionElement(section, index);
            sectionsContainer.appendChild(sectionElement);
        });
    }

    /**
     * Create a section element
     */
    createSectionElement(section, index) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'legal-section';
        sectionDiv.id = `section-${index + 1}`;
        
        const title = document.createElement('h2');
        title.className = 'legal-section-title';
        title.textContent = section.title;
        
        const content = document.createElement('div');
        content.className = 'legal-section-content';
        
        // Convert newlines and bullet points to proper HTML
        const formattedContent = this.formatContent(section.content);
        content.innerHTML = formattedContent;
        
        sectionDiv.appendChild(title);
        sectionDiv.appendChild(content);
        
        return sectionDiv;
    }

    /**
     * Format content with proper HTML structure
     */
    formatContent(content) {
        return content
            // Split by double newlines for paragraphs
            .split('\n\n')
            .map(paragraph => {
                // Check if it's a bullet list
                if (paragraph.includes('•')) {
                    const lines = paragraph.split('\n');
                    const intro = lines[0];
                    const bullets = lines.slice(1).filter(line => line.trim().startsWith('•'));
                    
                    let html = intro ? `<p>${intro}</p>` : '';
                    if (bullets.length > 0) {
                        html += '<ul>';
                        bullets.forEach(bullet => {
                            const text = bullet.replace('•', '').trim();
                            html += `<li>${text}</li>`;
                        });
                        html += '</ul>';
                    }
                    return html;
                } else {
                    // Regular paragraph
                    return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
                }
            })
            .join('');
    }

    /**
     * Generate navigation menu
     */
    generateNavigation() {
        const navContainer = document.getElementById('legal-nav');
        if (!navContainer || !this.content.sections) return;

        navContainer.innerHTML = '';
        
        this.content.sections.forEach((section, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'legal-nav-item';
            
            const link = document.createElement('a');
            link.href = `#section-${index + 1}`;
            link.className = 'legal-nav-link';
            link.textContent = section.title;
            
            listItem.appendChild(link);
            navContainer.appendChild(listItem);
        });
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        // Smooth scroll for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.legal-nav-link[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Update active navigation on scroll
        this.updateActiveNavigation();
    }

    /**
     * Setup scroll spy for navigation
     */
    setupScrollSpy() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        this.setActiveNavLink(id);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -35% 0px',
                threshold: 0
            }
        );

        // Observe all sections
        document.querySelectorAll('.legal-section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Set active navigation link
     */
    setActiveNavLink(sectionId) {
        // Remove active class from all links
        document.querySelectorAll('.legal-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        const activeLink = document.querySelector(`.legal-nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Update active navigation based on scroll position
     */
    updateActiveNavigation() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.legal-section[id]');
            let activeSection = null;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom > 200) {
                    activeSection = section.id;
                }
            });

            if (activeSection) {
                this.setActiveNavLink(activeSection);
            }
        });
    }

    /**
     * Add reading progress indicator
     */
    addReadingProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        
        const progressBarInner = progressBar.querySelector('.reading-progress-bar');
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            .reading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00D1B2, #FBBF24);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(progressBar);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBarInner.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    /**
     * Update contact information
     */
    updateContactInfo() {
        if (!this.config) return;

        // Update email links
        document.querySelectorAll('a[href*="admin@synapleads.com"]').forEach(link => {
            link.href = `mailto:${this.config.email}`;
            if (link.textContent === 'admin@synapleads.com') {
                link.textContent = this.config.email;
            }
        });

        // Update phone links (will be configured from main config)
        const phoneElements = document.querySelectorAll('#nav-phone, #footer-phone');
        phoneElements.forEach(element => {
            if (this.config.phone && this.config.phone !== 'Configurar en panel de administración') {
                element.href = `tel:${this.config.phone}`;
                const span = element.querySelector('span');
                if (span) span.textContent = this.config.phone;
            }
        });
    }

    /**
     * Setup analytics tracking
     */
    setupAnalytics() {
        // Track page view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: this.content.title,
                page_location: window.location.href,
                content_group1: 'Legal Pages'
            });
        }

        // Track section engagement
        document.addEventListener('click', (e) => {
            if (e.target.matches('.legal-nav-link')) {
                this.trackEvent('legal_navigation', {
                    section: e.target.textContent,
                    page: this.currentPage
                });
            }
            
            if (e.target.matches('a[href^="mailto:"]')) {
                this.trackEvent('legal_contact', {
                    method: 'email',
                    page: this.currentPage
                });
            }
        });

        // Track reading progress milestones
        this.trackReadingProgress();
    }

    /**
     * Track reading progress
     */
    trackReadingProgress() {
        const milestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackEvent('legal_reading_progress', {
                        milestone: milestone,
                        page: this.currentPage
                    });
                }
            });
        });
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, parameters) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, parameters);
            }
            
            // Also store in localStorage for debugging
            const events = JSON.parse(localStorage.getItem('synapleads_events') || '[]');
            events.push({
                event: eventName,
                parameters,
                timestamp: Date.now(),
                page: window.location.pathname
            });
            localStorage.setItem('synapleads_events', JSON.stringify(events.slice(-50)));
            
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Handle errors gracefully
     */
    handleError(error) {
        console.error('Legal page error:', error);
        
        // Show fallback content
        const sectionsContainer = document.getElementById('legal-sections');
        if (sectionsContainer) {
            sectionsContainer.innerHTML = `
                <div class="legal-section">
                    <h2 class="legal-section-title">Error de Carga</h2>
                    <div class="legal-section-content">
                        <p>Hubo un problema al cargar el contenido. Por favor, recarga la página o contáctanos si el problema persiste.</p>
                        <p><a href="mailto:admin@synapleads.com" class="btn btn-primary">Contactar Soporte</a></p>
                    </div>
                </div>
            `;
        }

        // Track error
        this.trackEvent('legal_page_error', {
            error: error.message,
            page: this.currentPage
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('legal-page') || 
        window.location.pathname.includes('privacidad') || 
        window.location.pathname.includes('terminos')) {
        
        window.legalPageManager = new LegalPageManager();
    }
});

// Export for use in other scripts
window.LegalPageManager = LegalPageManager;