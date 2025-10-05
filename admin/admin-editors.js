/**
 * Editores Específicos para Cada Sección del Sitio Web
 * Maneja la edición de contenido para Home, Landing, Gracias, Legal y Navegación
 */

// Extensión de AdminMain para editores específicos
AdminMain.prototype.renderHomeEditor = function(data) {
    return `
        <div class="fade-in">
            <div class="form-section">
                <h3><i class="fas fa-home mr-2"></i>Configuración Página Principal</h3>
                
                <!-- Hero Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Sección Hero</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="homeHeroTitle">Título Principal</label>
                            <input type="text" id="homeHeroTitle" value="${data.hero?.title || 'Conecta leads con agentes reales en segundos'}" placeholder="Título principal">
                        </div>
                        <div class="form-group">
                            <label for="homeHeroSubtitle">Subtítulo</label>
                            <textarea id="homeHeroSubtitle" rows="3" placeholder="Subtítulo descriptivo">${data.hero?.subtitle || 'La forma más rápida y confiable de escalar tu negocio de seguros'}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="homeHeroCTA">Texto del Botón Principal</label>
                            <input type="text" id="homeHeroCTA" value="${data.hero?.cta_text || 'Comenzar Ahora'}" placeholder="Texto del CTA">
                        </div>
                        <div class="form-group">
                            <label for="homeHeroStats">Estadística Destacada</label>
                            <input type="text" id="homeHeroStats" value="${data.hero?.stats || '50,000+ familias protegidas'}" placeholder="Estadística">
                        </div>
                    </div>
                </div>

                <!-- Servicios -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Servicios Principales</h4>
                    <div id="servicesEditor">
                        ${this.renderArrayEditor('services', data.services || [], {
                            title: 'Título del servicio',
                            description: 'Descripción del servicio',
                            icon: 'Clase del ícono (ej: fas fa-users)'
                        })}
                    </div>
                </div>

                <!-- Testimonios -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Testimonios</h4>
                    <div id="testimonialsEditor">
                        ${this.renderArrayEditor('testimonials', data.testimonials || [], {
                            name: 'Nombre del cliente',
                            company: 'Empresa',
                            text: 'Testimonio completo',
                            rating: 'Calificación (1-5)'
                        })}
                    </div>
                </div>
            </div>

            <div class="form-section">
                <button type="button" class="btn-primary" onclick="window.AdminMain.saveHomeContent()">
                    <i class="fas fa-save mr-2"></i>Guardar Página Home
                </button>
                <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.previewPage('home')">
                    <i class="fas fa-eye mr-2"></i>Vista Previa
                </button>
            </div>
        </div>
    `;
};

AdminMain.prototype.renderLandingEditor = function(data) {
    return `
        <div class="fade-in">
            <div class="form-section">
                <h3><i class="fas fa-bullseye mr-2"></i>Landing Page - Seguros de Gastos Finales</h3>
                
                <!-- Hero Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Sección Principal</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="landingHeroTitle">Título Principal</label>
                            <input type="text" id="landingHeroTitle" value="${data.hero?.title || 'Live Transfer para Seguros de Gastos Finales'}" placeholder="Título principal">
                        </div>
                        <div class="form-group">
                            <label for="landingHeroSubtitle">Subtítulo</label>
                            <textarea id="landingHeroSubtitle" rows="3" placeholder="Subtítulo descriptivo">${data.hero?.subtitle || 'Protege a tu familia con cobertura desde $5,000 hasta $30,000 sin examen médico'}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="landingBadge">Badge de Confianza</label>
                            <input type="text" id="landingBadge" value="${data.hero?.badge || '✓ Cobertura Inmediata'}" placeholder="Badge">
                        </div>
                        <div class="form-group">
                            <label for="landingStats">Estadística Principal</label>
                            <input type="text" id="landingStats" value="${data.hero?.stats || '+50K Familias Protegidas'}" placeholder="Estadística">
                        </div>
                    </div>
                </div>

                <!-- Beneficios del Seguro -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Beneficios del Seguro</h4>
                    <div id="benefitsEditor">
                        ${this.renderArrayEditor('benefits', data.benefits || this.getDefaultBenefits(), {
                            title: 'Título del beneficio',
                            description: 'Descripción detallada',
                            icon: 'Ícono (ej: fas fa-shield-alt)',
                            highlight: 'Texto destacado'
                        })}
                    </div>
                </div>

                <!-- FAQ -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Preguntas Frecuentes</h4>
                    <div id="faqEditor">
                        ${this.renderArrayEditor('faq', data.faq || this.getDefaultFAQ(), {
                            question: 'Pregunta',
                            answer: 'Respuesta completa'
                        })}
                    </div>
                </div>
            </div>

            <div class="form-section">
                <button type="button" class="btn-primary" onclick="window.AdminMain.saveLandingContent()">
                    <i class="fas fa-save mr-2"></i>Guardar Landing Page
                </button>
                <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.previewPage('landing')">
                    <i class="fas fa-eye mr-2"></i>Vista Previa
                </button>
            </div>
        </div>
    `;
};

AdminMain.prototype.renderGraciasEditor = function(data) {
    return `
        <div class="fade-in">
            <div class="form-section">
                <h3><i class="fas fa-heart mr-2"></i>Página de Agradecimiento</h3>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="graciasTitulo">Título Principal</label>
                        <input type="text" id="graciasTitulo" value="${data.title || '¡Gracias por tu solicitud!'}" placeholder="Título de agradecimiento">
                    </div>
                    <div class="form-group">
                        <label for="graciasSubtitulo">Subtítulo</label>
                        <textarea id="graciasSubtitulo" rows="3" placeholder="Mensaje de confirmación">${data.subtitle || 'Hemos recibido tu información. Un agente especializado se pondrá en contacto contigo muy pronto.'}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="graciasContador">Tiempo del Contador (minutos)</label>
                        <input type="number" id="graciasContador" value="${data.countdown_minutes || 5}" min="1" max="15">
                        <small class="text-gray-600">Tiempo de espera antes del contacto</small>
                    </div>
                </div>

                <!-- Pasos siguientes -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Próximos Pasos</h4>
                    <div id="stepsEditor">
                        ${this.renderArrayEditor('steps', data.steps || this.getDefaultSteps(), {
                            step_number: 'Número del paso',
                            title: 'Título del paso',
                            description: 'Descripción'
                        })}
                    </div>
                </div>

                <!-- Estadísticas de confianza -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Estadísticas de Confianza</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="graciasEstadistica1">Estadística 1</label>
                            <input type="text" id="graciasEstadistica1" value="${data.stats?.[0] || '50K+ Familias Protegidas'}" placeholder="Primera estadística">
                        </div>
                        <div class="form-group">
                            <label for="graciasEstadistica2">Estadística 2</label>
                            <input type="text" id="graciasEstadistica2" value="${data.stats?.[1] || 'Reclamos en 24 Horas'}" placeholder="Segunda estadística">
                        </div>
                        <div class="form-group">
                            <label for="graciasEstadistica3">Estadística 3</label>
                            <input type="text" id="graciasEstadistica3" value="${data.stats?.[2] || '98% Satisfacción'}" placeholder="Tercera estadística">
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <button type="button" class="btn-primary" onclick="window.AdminMain.saveGraciasContent()">
                    <i class="fas fa-save mr-2"></i>Guardar Página de Gracias
                </button>
                <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.previewPage('gracias')">
                    <i class="fas fa-eye mr-2"></i>Vista Previa
                </button>
            </div>
        </div>
    `;
};

AdminMain.prototype.renderLegalEditor = function(data) {
    return `
        <div class="fade-in">
            <div class="form-section">
                <h3><i class="fas fa-gavel mr-2"></i>Páginas Legales</h3>
                
                <!-- Política de Privacidad -->
                <div class="mb-8">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Política de Privacidad</h4>
                    <div class="form-group">
                        <label for="privacyLastUpdated">Fecha de Actualización</label>
                        <input type="date" id="privacyLastUpdated" value="${data.privacy?.lastUpdated || new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div id="privacyEditor">
                        ${this.renderArrayEditor('privacySections', data.privacy?.sections || this.getDefaultPrivacySections(), {
                            title: 'Título de la sección',
                            content: 'Contenido de la sección'
                        })}
                    </div>
                </div>

                <!-- Términos de Uso -->
                <div class="mb-8">
                    <h4 class="text-lg font-semibold mb-4 text-grafito">Términos de Uso</h4>
                    <div class="form-group">
                        <label for="termsLastUpdated">Fecha de Actualización</label>
                        <input type="date" id="termsLastUpdated" value="${data.terms?.lastUpdated || new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div id="termsEditor">
                        ${this.renderArrayEditor('termsSections', data.terms?.sections || this.getDefaultTermsSections(), {
                            title: 'Título de la sección',
                            content: 'Contenido de la sección'
                        })}
                    </div>
                </div>
            </div>

            <div class="form-section">
                <button type="button" class="btn-primary" onclick="window.AdminMain.saveLegalContent()">
                    <i class="fas fa-save mr-2"></i>Guardar Páginas Legales
                </button>
                <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.previewPage('legal')">
                    <i class="fas fa-eye mr-2"></i>Vista Previa
                </button>
            </div>
        </div>
    `;
};

AdminMain.prototype.renderNavigationEditor = function(data) {
    return `
        <div class="fade-in">
            <div class="form-section">
                <h3><i class="fas fa-bars mr-2"></i>Navegación del Sitio</h3>
                
                <div id="navigationEditor">
                    ${this.renderArrayEditor('navItems', data.items || this.getDefaultNavigation(), {
                        text: 'Texto del enlace',
                        url: 'URL de destino',
                        target: 'Target (_self, _blank)',
                        order: 'Orden de aparición'
                    })}
                </div>
            </div>

            <div class="form-section">
                <button type="button" class="btn-primary" onclick="window.AdminMain.saveNavigationContent()">
                    <i class="fas fa-save mr-2"></i>Guardar Navegación
                </button>
                <button type="button" class="btn-secondary ml-4" onclick="window.AdminMain.previewNavigation()">
                    <i class="fas fa-eye mr-2"></i>Vista Previa
                </button>
            </div>
        </div>
    `;
};

// Método para renderizar editores de arrays
AdminMain.prototype.renderArrayEditor = function(arrayName, items, fields) {
    let html = `<div class="array-editor" data-array="${arrayName}">`;
    
    items.forEach((item, index) => {
        html += `<div class="array-item" data-index="${index}">`;
        html += `<div class="array-item-header">`;
        html += `<div class="array-item-title">Elemento ${index + 1}</div>`;
        html += `<div class="array-item-actions">`;
        html += `<button type="button" class="btn-remove" onclick="this.closest('.array-item').remove(); window.AdminMain.markAsUnsaved();">`;
        html += `<i class="fas fa-trash"></i> Eliminar</button>`;
        html += `</div></div>`;
        
        Object.entries(fields).forEach(([fieldName, fieldLabel]) => {
            const fieldId = `${arrayName}_${index}_${fieldName}`;
            const fieldValue = item[fieldName] || '';
            
            html += `<div class="form-group">`;
            html += `<label for="${fieldId}">${fieldLabel}</label>`;
            
            if (fieldName === 'content' || fieldName === 'description' || fieldName === 'text' || fieldName === 'answer') {
                html += `<textarea id="${fieldId}" rows="4" onchange="window.AdminMain.markAsUnsaved()">${fieldValue}</textarea>`;
            } else {
                html += `<input type="text" id="${fieldId}" value="${fieldValue}" onchange="window.AdminMain.markAsUnsaved()">`;
            }
            
            html += `</div>`;
        });
        
        html += `</div>`;
    });
    
    html += `<button type="button" class="btn-add" onclick="window.AdminMain.addArrayItem('${arrayName}', ${JSON.stringify(fields).replace(/"/g, '&quot;')})">`;
    html += `<i class="fas fa-plus mr-2"></i>Agregar Elemento</button>`;
    html += `</div>`;
    
    return html;
};

// Método para agregar elementos a arrays
AdminMain.prototype.addArrayItem = function(arrayName, fields) {
    const container = document.querySelector(`[data-array="${arrayName}"]`);
    const items = container.querySelectorAll('.array-item');
    const index = items.length;
    
    let itemHtml = `<div class="array-item slide-down" data-index="${index}">`;
    itemHtml += `<div class="array-item-header">`;
    itemHtml += `<div class="array-item-title">Elemento ${index + 1}</div>`;
    itemHtml += `<div class="array-item-actions">`;
    itemHtml += `<button type="button" class="btn-remove" onclick="this.closest('.array-item').remove(); window.AdminMain.markAsUnsaved();">`;
    itemHtml += `<i class="fas fa-trash"></i> Eliminar</button>`;
    itemHtml += `</div></div>`;
    
    Object.entries(fields).forEach(([fieldName, fieldLabel]) => {
        const fieldId = `${arrayName}_${index}_${fieldName}`;
        
        itemHtml += `<div class="form-group">`;
        itemHtml += `<label for="${fieldId}">${fieldLabel}</label>`;
        
        if (fieldName === 'content' || fieldName === 'description' || fieldName === 'text' || fieldName === 'answer') {
            itemHtml += `<textarea id="${fieldId}" rows="4" onchange="window.AdminMain.markAsUnsaved()"></textarea>`;
        } else {
            itemHtml += `<input type="text" id="${fieldId}" onchange="window.AdminMain.markAsUnsaved()">`;
        }
        
        itemHtml += `</div>`;
    });
    
    itemHtml += `</div>`;
    
    const addButton = container.querySelector('.btn-add');
    addButton.insertAdjacentHTML('beforebegin', itemHtml);
    
    this.markAsUnsaved();
};

// Datos por defecto para diferentes secciones
AdminMain.prototype.getDefaultBenefits = function() {
    return [
        {
            title: "Sin Examen Médico",
            description: "Cobertura garantizada sin necesidad de exámenes médicos complicados",
            icon: "fas fa-stethoscope",
            highlight: "Aprobación rápida"
        },
        {
            title: "Primas Fijas",
            description: "Tus pagos nunca aumentarán, garantía de por vida",
            icon: "fas fa-lock",
            highlight: "Nunca aumenta"
        },
        {
            title: "Cobertura Inmediata",
            description: "Protección completa desde el primer día de tu póliza",
            icon: "fas fa-clock",
            highlight: "Desde día 1"
        }
    ];
};

AdminMain.prototype.getDefaultFAQ = function() {
    return [
        {
            question: "¿En cuánto tiempo me contactan?",
            answer: "Un agente especializado se pondrá en contacto contigo en un promedio de 5 a 30 segundos después de enviar tu solicitud."
        },
        {
            question: "¿Puedo recibir información por WhatsApp?",
            answer: "Sí, tenemos la opción de contacto por WhatsApp disponible para mayor comodidad."
        },
        {
            question: "¿Qué documentos necesito?",
            answer: "Solo necesitas una identificación válida. No se requieren exámenes médicos ni documentación compleja."
        }
    ];
};

AdminMain.prototype.getDefaultSteps = function() {
    return [
        {
            step_number: "1",
            title: "Análisis de tu solicitud",
            description: "Revisamos tu información para encontrar la mejor opción"
        },
        {
            step_number: "2",
            title: "Contacto personalizado",
            description: "Un agente especializado te llama para explicar todo en detalle"
        },
        {
            step_number: "3",
            title: "Protección activada",
            description: "Tu familia queda protegida con la cobertura que necesitas"
        }
    ];
};

AdminMain.prototype.getDefaultPrivacySections = function() {
    return [
        {
            title: "Información que Recopilamos",
            content: "Recopilamos información personal que nos proporcionas voluntariamente cuando solicitas nuestros servicios..."
        },
        {
            title: "Uso de la Información",
            content: "Utilizamos la información recopilada para proporcionar y mejorar nuestros servicios..."
        }
    ];
};

AdminMain.prototype.getDefaultTermsSections = function() {
    return [
        {
            title: "Aceptación de los Términos",
            content: "Al utilizar nuestros servicios, usted acepta estar sujeto a estos términos y condiciones..."
        },
        {
            title: "Descripción del Servicio",
            content: "Synapleads proporciona servicios de generación de leads para seguros de gastos finales..."
        }
    ];
};

AdminMain.prototype.getDefaultNavigation = function() {
    return [
        { text: "Inicio", url: "index.html", target: "_self", order: 1 },
        { text: "Seguros", url: "landing-seguros.html", target: "_self", order: 2 },
        { text: "Contacto", url: "#contact", target: "_self", order: 3 },
        { text: "Privacidad", url: "privacidad.html", target: "_self", order: 4 }
    ];
};

// Métodos de guardado específicos
AdminMain.prototype.saveHomeContent = async function() {
    // Implementar lógica de guardado para Home
    console.log('Guardando contenido Home...');
    this.showSuccess('Contenido de Home guardado exitosamente');
};

AdminMain.prototype.saveLandingContent = async function() {
    // Implementar lógica de guardado para Landing
    console.log('Guardando contenido Landing...');
    this.showSuccess('Contenido de Landing guardado exitosamente');
};

AdminMain.prototype.saveGraciasContent = async function() {
    // Implementar lógica de guardado para Gracias
    console.log('Guardando contenido Gracias...');
    this.showSuccess('Contenido de página de Gracias guardado exitosamente');
};

AdminMain.prototype.saveLegalContent = async function() {
    // Implementar lógica de guardado para Legal
    console.log('Guardando contenido Legal...');
    this.showSuccess('Contenido legal guardado exitosamente');
};

AdminMain.prototype.saveNavigationContent = async function() {
    // Implementar lógica de guardado para Navegación
    console.log('Guardando navegación...');
    this.showSuccess('Navegación guardada exitosamente');
};

// Métodos de preview específicos
AdminMain.prototype.previewPage = function(page) {
    let url;
    switch (page) {
        case 'home':
            url = '../index.html';
            break;
        case 'landing':
            url = '../landing-seguros.html';
            break;
        case 'gracias':
            url = '../gracias.html';
            break;
        case 'legal':
            url = '../privacidad.html';
            break;
        default:
            url = '../index.html';
    }
    
    this.openPreview(url);
};

AdminMain.prototype.openPreview = function(url) {
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
};