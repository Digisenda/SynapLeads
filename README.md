# 🌐 Synapleads Website

Este repositorio contiene el **sitio web oficial de Synapleads**, la plataforma que conecta leads de seguros con agentes reales en segundos.  
Funciona como **base pública de marca y captación de leads**, complementando la aplicación interna en `panel.synapleads.com` (DeepAgent).

El objetivo de este repositorio es:
- Proveer una **web de presentación corporativa** (branding + credibilidad).
- Alojar **landing pages específicas** para campañas de marketing (ej: Seguros de Gastos Finales).
- Servir como **punto de captación** de leads mediante formularios conectados a los endpoints definidos en la app.
- Permitir edición rápida de textos, imágenes y enlaces a través de archivos JSON (no requiere modificar HTML).

---

## 📂 Estructura de Archivos y Carpetas

/ (raíz del repositorio)
│
├── index.html → Página principal (branding general)
├── landing-seguros.html → Landing page de Seguros Gastos Finales
├── privacidad.html → Política de Privacidad (pendiente)
├── terminos.html → Términos y Condiciones (pendiente)
│
├── css/ → Estilos
│ ├── styles.css → Estilos globales
│ └── landing.css → Estilos de la landing de seguros
│
├── js/ → Lógica del sitio
│ ├── main.js → Funciones globales (navegación, tracking, validaciones)
│ ├── home.js → Scripts de la página principal
│ ├── landing.js → Scripts de la landing (formularios y CTAs)
│ └── content-loader.js → Carga dinámica de contenido desde JSON
│
├── data/ → Contenido editable
│ ├── config.json → Configuración general (colores, contacto, tracking)
│ ├── home-content.json → Contenido de la home
│ ├── landing-content.json → Contenido de la landing
│ ├── navigation.json → Menús de navegación y footer
│ └── legal-content.json → Textos legales
│
├── assets/images/ → Logos, favicon e imágenes de marca
└── images/ → Imágenes de campañas y landings

---

## 🚀 Publicación

Este sitio está pensado para deploy en **GitHub Pages + Cloudflare**:  
- Rama principal: `main`  
- Dominio: `https://synapleads.com`  

URLs principales:  
- **Home:** `https://synapleads.com/`  
- **Landing Seguros:** `https://synapleads.com/landing-seguros.html`  
- **Privacidad:** `https://synapleads.com/privacidad.html`  
- **Términos:** `https://synapleads.com/terminos.html`  

---

## 🛠️ Próximos pasos

1. Completar páginas **privacidad.html** y **terminos.html** con contenido de `legal-content.json`.  
2. Crear página **gracias.html** para redirección post-formulario (con contador 15–30s).  
3. Configurar endpoints (`lead_endpoint`, `webhook_url`) en `config.json`.  
4. Insertar IDs reales de **GA4** y **Meta Pixel** en `config.json`.  
5. Añadir imágenes finales (logo, favicon, fondos, testimonios) en `/assets/images` y `/images`.

---

## 📌 Notas

- El sitio está diseñado **mobile-first** y optimizado para velocidad.  
- Todos los textos e imágenes clave son editables vía archivos JSON.  
- El control de leads, nurturing y Live Transfer se realiza en la **app interna (DeepAgent)**.  
- Este repositorio se limita al **front-end público de marketing**.  
