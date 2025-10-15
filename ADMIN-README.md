# Panel de Administración Synapleads
## Sistema de Gestión de Contenido Sin Código

### 🎯 **DESCRIPCIÓN GENERAL**

El Panel de Administración de Synapleads es un sistema completo de gestión de contenido que permite editar todo el sitio web sin conocimientos técnicos. Diseñado específicamente para actualizar contenido, configuración, colores, contactos y toda la información del sitio de forma intuitiva.

---

## 🚀 **ACCESO AL PANEL**

### **URL de Acceso:**
```
https://tu-dominio.com/admin/
```

### **Credenciales por Defecto:**
- **Usuario:** `admin`
- **Contraseña:** `synapleads2025`

> ⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer acceso por seguridad.

---

## 📋 **FUNCIONALIDADES PRINCIPALES**

### ✅ **1. Configuración Global**
- **Información del Sitio:** Nombre, eslogan, descripción
- **Colores Corporativos:** Selector visual de colores (grafito, turquesa, dorado)
- **Información de Contacto:** Teléfono, WhatsApp, email, dirección
- **Analytics:** Google Analytics 4, Meta Pixel, GTM
- **Redes Sociales:** Enlaces a perfiles sociales

### ✅ **2. Página Principal (Home)**
- **Sección Hero:** Título, subtítulo, CTA, estadísticas
- **Servicios:** Editor de array para servicios principales
- **Beneficios:** Beneficios destacados con iconos
- **Testimonios:** Testimonios de clientes con calificaciones
- **Estadísticas:** Números de confianza y logros

### ✅ **3. Landing Page de Seguros**
- **Hero Section:** Título, subtítulo, badge, estadísticas
- **Beneficios del Seguro:** 6 beneficios principales extraídos del PDF
- **Detalles de Cobertura:** Rangos de edad, montos, opciones de pago
- **Formulario:** Campos personalizables con validación
- **FAQ:** Preguntas frecuentes con acordeón
- **Testimonios:** Testimonios específicos de seguros
- **Garantías:** Sellos de confianza y garantías

### ✅ **4. Página de Agradecimiento**
- **Configuración del Contador:** Tiempo de espera personalizable
- **Pasos Siguientes:** Proceso post-formulario
- **Estadísticas de Confianza:** Números de respaldo
- **Opciones de Contacto:** Botones de llamada y WhatsApp
- **Información de Seguridad:** Mensaje de privacidad
- **Prueba Social:** Reseñas recientes y calificaciones

### ✅ **5. Páginas Legales**
- **Política de Privacidad:** Editor de secciones completas
- **Términos de Uso:** Contenido legal estructurado
- **Fechas de Actualización:** Control de versiones
- **Información Corporativa:** Datos legales de la empresa

### ✅ **6. Navegación del Sitio**
- **Menú Principal:** Elementos de navegación con iconos
- **Footer:** Enlaces organizados por secciones
- **Navegación Móvil:** Menú optimizado para móviles
- **Breadcrumbs:** Migas de pan automáticas
- **CTAs:** Botones de llamada a la acción

---

## 🛠️ **CÓMO USAR EL PANEL**

### **Paso 1: Acceso**
1. Navega a `/admin/` en tu sitio web
2. Ingresa usuario: `admin` y contraseña: `synapleads2025`
3. Haz clic en "Acceder al Panel"

### **Paso 2: Navegación**
- Usa las **pestañas superiores** para cambiar entre secciones
- Cada pestaña tiene un editor específico para su contenido
- Los cambios se marcan automáticamente como "no guardados"

### **Paso 3: Edición**
- **Texto simple:** Campos de input normales
- **Texto largo:** Áreas de texto para descripciones
- **Colores:** Selector visual + campo hexadecimal
- **Arrays:** Botón "Agregar Elemento" para listas dinámicas
- **Fechas:** Selector de fecha para contenido legal

### **Paso 4: Guardado**
- Haz clic en **"Guardar"** en cada sección después de hacer cambios
- El sistema muestra confirmación de guardado exitoso
- Los cambios se reflejan inmediatamente en el sitio web

### **Paso 5: Vista Previa**
- Usa el botón **"Vista Previa"** para ver los cambios antes de publicar
- Se abre en una nueva ventana para comparar

---

## 🎨 **EDITORES ESPECÍFICOS**

### **Editor de Arrays (Servicios, Testimonios, FAQ, etc.)**
- **Agregar:** Botón "Agregar Elemento" al final de cada lista
- **Eliminar:** Botón "Eliminar" en cada elemento individual  
- **Reordenar:** Arrastra elementos para cambiar el orden
- **Campos:** Cada elemento tiene campos específicos (título, descripción, icono, etc.)

### **Editor de Colores**
- **Preview Visual:** Cuadro de color que muestra el color actual
- **Selector:** Haz clic en el preview para abrir el selector de color
- **Campo Hex:** Ingresa códigos hexadecimales directamente (#RRGGBB)
- **Sincronización:** Los cambios se sincronizan entre selector y campo de texto

### **Editor de Formularios**
- **Campos:** Nombre, etiqueta, tipo, requerido, placeholder
- **Validación:** Configuración de reglas de validación
- **Opciones:** Para campos select y radio
- **Redirección:** URL de destino después del envío

---

## 🔒 **SEGURIDAD**

### **Autenticación**
- Sistema de login con credenciales personalizables
- Sesión segura con expiración automática (8 horas)
- Extensión automática de sesión con actividad del usuario
- Logout seguro con confirmación

### **Protección de Datos**
- Todos los cambios se validan antes del guardado
- Backup automático de configuraciones anteriores
- Sistema de rollback en caso de errores
- Encriptación de datos sensibles

### **Control de Acceso**
- URL de admin protegida (`/admin/`)
- Verificación de sesión en cada acción
- Timeout automático por inactividad
- Protección contra ataques de fuerza bruta

---

## 📊 **ARCHIVOS JSON DEL SISTEMA**

### **Estructura de Datos:**
```
data/
├── config.json          # Configuración global
├── home-content.json    # Contenido página principal  
├── landing-content.json # Contenido landing seguros
├── gracias-content.json # Contenido página gracias
├── legal-content.json   # Contenido páginas legales
└── navigation.json      # Navegación del sitio
```

### **Ejemplo de Estructura JSON:**
```json
{
  "hero": {
    "title": "Tu título aquí",
    "subtitle": "Tu subtítulo aquí",
    "cta_text": "Botón principal"
  },
  "services": [
    {
      "title": "Servicio 1",
      "description": "Descripción del servicio",
      "icon": "fas fa-icon"
    }
  ]
}
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: No se puede acceder al panel**
- Verifica que estés usando la URL correcta: `/admin/`
- Comprueba las credenciales: `admin` / `synapleads2025`
- Limpia caché del navegador y cookies
- Intenta desde una ventana privada/incógnita

### **Error: Los cambios no se guardan**
- Verifica que todos los campos requeridos estén completos
- Comprueba la conexión a internet
- Refresca la página y vuelve a intentar
- Revisa la consola del navegador por errores JavaScript

### **Error: Vista previa no funciona**
- Verifica que las páginas del sitio existan
- Comprueba permisos de archivos en el servidor
- Asegúrate que el navegador permita ventanas emergentes
- Prueba abriendo las páginas directamente

### **Error: Sesión expirada**
- La sesión dura 8 horas por defecto
- Haz login nuevamente con las credenciales
- Verifica que las cookies estén habilitadas
- Contacta al administrador si persiste

---

## 🔧 **MANTENIMIENTO**

### **Backup de Datos**
- Los archivos JSON se guardan automáticamente
- Realiza backups manuales periódicamente
- Guarda copias de los archivos en `/data/` antes de cambios importantes
- Documenta cambios significativos

### **Actualizaciones**
- Revisa periódicamente por actualizaciones del sistema
- Prueba cambios en un entorno de prueba primero
- Mantén copias de respaldo antes de actualizar
- Documenta cualquier personalización

### **Monitoreo**
- Revisa logs del servidor regularmente
- Monitorea el rendimiento del sitio web
- Verifica que todos los formularios funcionen
- Prueba la integración de analytics

---

## 📞 **SOPORTE TÉCNICO**

### **Contacto:**
- **Email:** admin@synapleads.com
- **Teléfono:** +1 (817) 670-5508
- **Horarios:** Lunes a Viernes, 9:00 AM - 6:00 PM CST

### **Documentación Adicional:**
- Manual de usuario completo disponible
- Videos tutoriales en el portal de soporte
- Base de conocimiento con preguntas frecuentes
- Foro de la comunidad para consultas

---

## 📝 **CHANGELOG**

### **Versión 1.0.0 (2025-01-01)**
- ✅ Sistema de autenticación completo
- ✅ Editores para todas las secciones del sitio
- ✅ Sistema de guardado y validación
- ✅ Preview en tiempo real
- ✅ Interfaz responsive y moderna
- ✅ Documentación completa

### **Próximas Funcionalidades:**
- 🔄 Editor WYSIWYG para texto rico
- 🔄 Subida de imágenes integrada
- 🔄 Gestión de usuarios múltiples
- 🔄 Historial de cambios detallado
- 🔄 Integración con APIs externas

---

**© 2025 Synapleads LLC. Todos los derechos reservados.**