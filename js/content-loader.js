/**
 * Sistema de carga de contenido dinámico desde archivos JSON
 * Permite la edición sin código del sitio web
 */

class ContentLoader {
    constructor() {
        this.cache = new Map();
        this.baseURL = window.location.origin;
    }

    /**
     * Carga un archivo JSON desde la carpeta data/
     * @param {string} filename - Nombre del archivo JSON (sin extensión)
     * @returns {Promise<Object>} - Contenido del archivo JSON
     */
    async loadJSON(filename) {
        const cacheKey = filename;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseURL}/data/${filename}.json`);
            if (!response.ok) {
                throw new Error(`Error cargando ${filename}: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error cargando contenido de ${filename}:`, error);
            return null;
        }
    }

    /**
     * Aplica configuración global del sitio
     */
    async applyGlobalConfig() {
        const config = await this.loadJSON('config');
        if (!config) return;

        // Aplicar colores CSS
        const root = document.documentElement;
        Object.entries(config.colors).forEach(([name, value]) => {
            root.style.setProperty(`--color-${name.replace('_', '-')}`, value);
        });

        // Configurar título del sitio
        if (config.site.name) {
            document.title = document.title.replace('Synapleads', config.site.name);
        }

        // Configurar favicon si existe
        if (config.site.favicon) {
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = config.site.favicon;
            }
        }

        return config;
    }

    /**
     * Carga y aplica la navegación
     */
    async loadNavigation() {
        const navigation = await this.loadJSON('navigation');
        if (!navigation) return;

        // Cargar navegación principal
        const mainNav = document.querySelector('#main-navigation');
        if (mainNav && navigation.main_navigation) {
            mainNav.innerHTML = navigation.main_navigation.map(item => `
                <li><a href="${item.url}" class="nav-link">${item.title}</a></li>
            `).join('');
        }

        // Cargar navegación del footer
        const footerNav = document.querySelector('#footer-navigation');
        if (footerNav && navigation.footer_navigation) {
            let footerHTML = '';
            
            if (navigation.footer_navigation.company) {
                footerHTML += `
                    <div class="footer-section">
                        <h4>Empresa</h4>
                        <ul>
                            ${navigation.footer_navigation.company.map(item => 
                                `<li><a href="${item.url}">${item.title}</a></li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
            }

            if (navigation.footer_navigation.legal) {
                footerHTML += `
                    <div class="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            ${navigation.footer_navigation.legal.map(item => 
                                `<li><a href="${item.url}">${item.title}</a></li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
            }

            footerNav.innerHTML = footerHTML;
        }

        return navigation;
    }

    /**
     * Reemplaza texto en elementos con data-content
     * @param {string} selector - Selector del elemento
     * @param {string} content - Contenido a insertar
     */
    setContent(selector, content) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = content;
            } else if (el.tagName === 'A') {
                el.href = content;
            } else {
                el.textContent = content;
            }
        });
    }

    /**
     * Reemplaza HTML en elementos con data-html
     * @param {string} selector - Selector del elemento  
     * @param {string} html - HTML a insertar
     */
    setHTML(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.innerHTML = html;
        });
    }

    /**
     * Inicialización automática cuando el DOM esté listo
     */
    async init() {
        await this.applyGlobalConfig();
        await this.loadNavigation();
        
        // Disparar evento personalizado cuando el contenido esté cargado
        document.dispatchEvent(new CustomEvent('contentLoaded'));
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.contentLoader = new ContentLoader();
    window.contentLoader.init();
});