# Plan de Escalado en 4 Fases -- SynapLeads (Versión Definitiva)

## Fase 1 -- Consolidación del Core (MVP estable)

• Conectar la app a una base de datos real (Postgres/Supabase) vía
Secrets.

• Mejorar la gestión de usuarios (editar, bloquear, eliminar, desbloqueo
admin).

• Flujo de contraseñas completo: "Olvidé mi password" + bloqueo tras 5
intentos fallidos + desbloqueo admin + logs.

• Verificar logs del sistema, exportación CSV/JSON y health check con
DB/SMTP/Twilio.

## Fase 2 -- Live Transfer y Nurturing por SMS

• Implementar Click-to-Call directo (Twilio) desde campañas Meta Ads
(Campaña A).

• Implementar Lead Form → webhook → Live Transfer agent-first con Twilio
(Campaña B).

• Activar notificaciones a agentes vía SMS (Twilio).

• Habilitar nurturing principal por SMS (Twilio) con plantillas
predefinidas. WhatsApp Business API en una etapa posterior. Voz con
Retell AI en fase aún más avanzada.

## Fase 3 -- RAG e IA Conversacional

• Cargar knowledge base (docs, PDFs, FAQs) directamente en SynapLeads
(no micro-apps).

• Configurar el prompt base del agente RAG para guiones de llamada,
nurturing y respuestas.

• Añadir un panel lateral en /leads/:id para "Guión sugerido (RAG)"
mostrando respuestas + fuentes.

• Integrar la API de OpenAI para análisis de sentimiento en nurturing
SMS → clasificar y responder según tono detectado.

## Fase 4 -- Escalado y Canales Avanzados

• Integrar WhatsApp Business API (Twilio/Meta) para nurturing
multicanal.

• Evaluar integración de Retell AI solo como fallback de voz (cuando
agente no contesta).

• Añadir métricas avanzadas: Tasa de conversión por canal y métricas
diferenciadas por agente.

• Crear versión empaquetada PWA descargable en Android/iOS para uso de
agentes.

# Agrupación de tareas en micro-prompts

## Fase 1

• 1.1 Conexión a base de datos real

• 1.2 Gestión de usuarios (editar, bloquear, eliminar, desbloqueo admin)

• 1.3 Flujo completo de contraseñas (reset, bloqueo, logs)

• 1.4 Logs + Export + Health check

## Fase 2

• 2.1 Click-to-Call (Twilio)

• 2.2 Lead Form → webhook → Live Transfer agent-first

• 2.3 Notificaciones SMS a agentes (Twilio)

• 2.4 Nurturing básico SMS (plantillas, envío masivo simple)

## Fase 3

• 3.1 Carga y configuración inicial de Knowledge Base

• 3.2 Prompt base del agente RAG (guiones y nurturing)

• 3.3 Panel lateral /leads/:id con guiones RAG + fuentes

• 3.4 Integración API OpenAI → análisis de sentimiento en nurturing

## Fase 4

• 4.1 WhatsApp Business API

• 4.2 Retell AI como fallback de voz

• 4.3 Métricas avanzadas (conversión y por agente)

• 4.4 PWA descargable Android/iOS
