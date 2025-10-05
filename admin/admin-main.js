/**
 * Sistema Principal del Panel de Administración Synapleads
 * Maneja navegación, carga de contenido y funcionalidades generales
 */

class AdminMain {
    constructor() {
        this.initialized = false;
        this.currentTab = 'config';
        this.dataCache = {};
        this.unsavedChanges = false;
        
        // Rutas de archivos JSON
        this.jsonPaths = {
            config: '../data/config.json',
            home: '../data/home-content.json',
            landing: '../data/landing-content.json',
            gracias: '../data/gracias-content.json',
            legal: '../data/legal-content.json',
            navigation: '../data/navigation.json'
        };
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            this.bindEvents();
            await this.loadAllData();
            this.showTab('config');
            this.initialized = true;
            
            console.log('Panel de administración inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando panel:', error);
            this.showError('Error al inicializar el panel de administración');
        }
    }
    
    bindEvents() {
        // Navegación entre tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.showTab(tab);
            });
        });
        
        // Botón de preview
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showPreview();
            });
        }
        
        // Detectar cambios no guardados
        window.addEventListener('beforeunload', (e) => {
            if (this.unsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        
        // Auto-save cada 30 segundos
        setInterval(() => {
            if (this.unsavedChanges) {
                this.autoSave();
            }
        }, 30000);
    }
    
    async loadAllData() {
        const loadPromises = Object.entries(this.jsonPaths).map(async ([key, path]) => {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    this.dataCache[key] = await response.json();
                } else {
                    console.warn(`No se pudo cargar ${path}`);
                    this.dataCache[key] = this.getDefaultData(key);
                }
            } catch (error) {
                console.warn(`Error cargando ${path}:`, error);
                this.dataCache[key] = this.getDefaultData(key);
            }
        });
        
        await Promise.all(loadPromises);
        console.log('Datos cargados:', this.dataCache);
    }
    
    getDefaultData(type) {
        const defaults = {
            config: {
                siteName: "Synapleads",
                tagline: "Conecta leads con agentes reales en segundos",
                colors: {
                    grafito: "#1C1C1E",
                    turquesa: "#00D1B2",
                    dorado: "#FBBF24"
                },
                contact: {
                    phone: "+1 (555) 123-4567",
                    whatsapp: "+1 (555) 123-4567",
                    email: "admin@synapleads.com"
                },
                analytics: {
                    ga4_id: "",
                    meta_pixel_id: ""
                }
            },
            home: { sections: [] },
            landing: { sections: [] },
            gracias: { sections: [] },
            legal: { pages: [] },
            navigation: { items: [] }
        };
        
        return defaults[type] || {};
    }
    
    showTab(tabName) {
        // Actualizar navegación
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('text-gray-500');
            btn.classList.remove('text-turquesa', 'border-turquesa');
            btn.classList.add('border-transparent');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.classList.remove('text-gray-500');
            activeBtn.classList.add('text-turquesa', 'border-turquesa');
            activeBtn.classList.remove('border-transparent');
        }
        
        this.currentTab = tabName;
        this.renderTabContent(tabName);
    }
    
    renderTabContent(tabName) {
        const contentArea = document.getElementById('content-area');
        const data = this.dataCache[tabName];
        
        if (!data) {
            contentArea.innerHTML = `
                <div class="status-message status-error">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Error cargando datos para ${tabName}
                </div>
            `;
            return;
        }
        
        switch (tabName) {
            case 'config':
                contentArea.innerHTML = this.renderConfigEditor(data);
                break;
            case 'home':
                contentArea.innerHTML = this.renderHomeEditor(data);
                break;
            case 'landing':
                contentArea.innerHTML = this.renderLandingEditor(data);
                break;
            case 'gracias':
                contentArea.innerHTML = this.renderGraciasEditor(data);
                break;
            case 'legal':
                contentArea.innerHTML = this.renderLegalEditor(data);
                break;
            case 'navigation':
                contentArea.innerHTML = this.renderNavigationEditor(data);
                break;
            default:
                contentArea.innerHTML = '<div class="status-message status-warning">Tab no encontrado</div>';
        }
        
        this.bindTabEvents(tabName);
    }
    
    renderConfigEditor(data) {
        return `
            <div class="fade-in">
                <div class="form-section">
                    <h3><i class="fas fa-cog mr-2"></i>Información General del Sitio</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="siteName">Nombre del Sitio</label>
                            <input type="text" id="siteName" value="${data.siteName || ''}" placeholder="Synapleads">
                        </div>
                        <div class="form-group">
                            <label for="tagline">Eslogan Principal</label>
                            <input type="text" id="tagline" value="${data.tagline || ''}" placeholder="Conecta leads con agentes reales...">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-palette mr-2"></i>Colores Corporativos</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="colorGrafito">Color Grafito (Principal)</label>
                            <div class="color-picker-wrapper">
                                <div class="color-preview" style="background-color: ${data.colors?.grafito || '#1C1C1E'}" onclick="document.getElementById('colorGrafito').click()"></div>
                                <input type="color" id="colorGrafito" class="color-input" value="${data.colors?.grafito || '#1C1C1E'}">
                                <input type="text" value="${data.colors?.grafito || '#1C1C1E'}" placeholder="#1C1C1E" class="color-text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="colorTurquesa">Color Turquesa (Acento)</label>
                            <div class="color-picker-wrapper">
                                <div class="color-preview" style="background-color: ${data.colors?.turquesa || '#00D1B2'}" onclick="document.getElementById('colorTurquesa').click()"></div>
                                <input type="color" id="colorTurquesa" class="color-input" value="${data.colors?.turquesa || '#00D1B2'}">
                                <input type="text" value="${data.colors?.turquesa || '#00D1B2'}" placeholder="#00D1B2" class="color-text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="colorDorado">Color Dorado (Detalles)</label>
                            <div class="color-picker-wrapper">
                                <div class="color-preview" style="background-color: ${data.colors?.dorado || '#FBBF24'}" onclick="document.getElementById('colorDorado').click()"></div>
                                <input type="color" id="colorDorado" class="color-input" value="${data.colors?.dorado || '#FBBF24'}">
                                <input type="text" value="${data.colors?.dorado || '#FBBF24'}" placeholder="#FBBF24" class="color-text">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-phone mr-2"></i>Información de Contacto</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="phone">Teléfono Principal</label>
                            <input type="tel" id="phone" value="${data.contact?.phone || ''}" placeholder="+1 (555) 123-4567">
                        </div>
                        <div class="form-group">
                            <label for="whatsapp">WhatsApp</label>
                            <input type="tel" id="whatsapp" value="${data.contact?.whatsapp || ''}" placeholder="+1 (555) 123-4567">
                        </div>
                        <div class="form-group">
                            <label for="email">Email de Contacto</label>
                            <input type="email" id="email" value="${data.contact?.email || ''}" placeholder="admin@synapleads.com">
                        </div>
                        <div class="form-group">
                            <label for="address">Dirección</label>
                            <input type="text" id="address" value="${data.contact?.address || ''}" placeholder="San Antonio, TX, USA">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-chart-line mr-2"></i>Analytics y Tracking</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="ga4Id">Google Analytics 4 ID</label>
                            <input type="text" id="ga4Id" value="${data.analytics?.ga4_id || ''}" placeholder="G-XXXXXXXXXX">
                            <small class="text-gray-600">Formato: G-XXXXXXXXXX</small>
                        </div>
                        <div class="form-group">
                            <label for="metaPixelId">Meta Pixel ID</label>
                            <input type="text" id="metaPixelId" value="${data.analytics?.meta_pixel_id || ''}" placeholder="123456789012345">
                            <small class="text-gray-600">Número de 15 dígitos</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <button type="button" class="btn-primary" onclick="window.AdminMain.saveConfig()">
                        <i class="fas fa-save mr-2"></i>Guardar Configuración
                    </button>
                    <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.resetConfig()">
                        <i class="fas fa-undo mr-2"></i>Restaurar Valores
                    </button>
                </div>
            </div>
        `;
    }
    
    bindTabEvents(tabName) {
        // Eventos de cambio de color
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            colorInput.addEventListener('change', (e) => {
                const preview = e.target.parentNode.querySelector('.color-preview');
                const textInput = e.target.parentNode.querySelector('.color-text');
                
                if (preview) preview.style.backgroundColor = e.target.value;
                if (textInput) textInput.value = e.target.value;
                
                this.markAsUnsaved();
            });
        });
        
        // Eventos de cambio de texto de color
        document.querySelectorAll('.color-text').forEach(textInput => {
            textInput.addEventListener('change', (e) => {
                const colorInput = e.target.parentNode.querySelector('input[type="color"]');
                const preview = e.target.parentNode.querySelector('.color-preview');
                
                if (this.isValidHexColor(e.target.value)) {
                    if (colorInput) colorInput.value = e.target.value;
                    if (preview) preview.style.backgroundColor = e.target.value;
                    this.markAsUnsaved();
                }
            });
        });
        
        // Eventos de cambio general en inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('change', () => {
                this.markAsUnsaved();
            });
        });
    }
    
    isValidHexColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    
    markAsUnsaved() {
        this.unsavedChanges = true;
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn && !saveBtn.textContent.includes('*')) {
            saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Guardar Cambios *';
        }
    }
    
    async saveConfig() {
        const saveBtn = document.querySelector('.btn-primary');
        const originalText = saveBtn.innerHTML;
        
        try {
            saveBtn.innerHTML = '<span class="loading-spinner mr-2"></span>Guardando...';
            saveBtn.disabled = true;
            
            const configData = {
                siteName: document.getElementById('siteName').value,
                tagline: document.getElementById('tagline').value,
                colors: {
                    grafito: document.getElementById('colorGrafito').value,
                    turquesa: document.getElementById('colorTurquesa').value,
                    dorado: document.getElementById('colorDorado').value
                },
                contact: {
                    phone: document.getElementById('phone').value,
                    whatsapp: document.getElementById('whatsapp').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value
                },
                analytics: {
                    ga4_id: document.getElementById('ga4Id').value,
                    meta_pixel_id: document.getElementById('metaPixelId').value
                }
            };
            
            // Actualizar cache
            this.dataCache.config = configData;
            
            // Simular guardado (en producción sería una llamada a API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showSuccess('Configuración guardada exitosamente');
            this.unsavedChanges = false;
            
        } catch (error) {
            console.error('Error guardando configuración:', error);
            this.showError('Error al guardar la configuración');
        } finally {
            saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Guardar Configuración';
            saveBtn.disabled = false;
        }
    }
    
    resetConfig() {
        if (confirm('¿Está seguro que desea restaurar los valores originales?')) {
            this.dataCache.config = this.getDefaultData('config');
            this.renderTabContent('config');
            this.showSuccess('Valores restaurados');
        }
    }
    
    showSuccess(message) {
        this.showStatus(message, 'success');
    }
    
    showError(message) {
        this.showStatus(message, 'error');
    }
    
    showWarning(message) {
        this.showStatus(message, 'warning');
    }
    
    showStatus(message, type) {
        const statusDiv = document.getElementById('saveStatus');
        statusDiv.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg status-${type}`;
        statusDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'exclamation-triangle'} mr-2"></i>${message}`;
        statusDiv.classList.remove('hidden');
        
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 4000);
    }
    
    showPreview() {
        const previewModal = document.createElement('div');
        previewModal.className = 'preview-modal';
        previewModal.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h3><i class="fas fa-eye mr-2"></i>Vista Previa del Sitio</h3>
                    <button class="close-preview" onclick="this.closest('.preview-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <iframe class="preview-iframe" src="../index.html"></iframe>
            </div>
        `;
        
        document.body.appendChild(previewModal);
    }
    
    async autoSave() {
        try {
            console.log('Auto-guardado ejecutado');
            // Implementar auto-save logic aquí
        } catch (error) {
            console.error('Error en auto-guardado:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.AdminMain = new AdminMain();
});