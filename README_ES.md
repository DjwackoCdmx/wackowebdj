# Sistema Web de Solicitud de Canciones con Propinas para DJs (Djwacko)

## Contexto del Proyecto

**Fecha:** 19 de julio de 2025

**Objetivo general:**
Diseñar un monorepo moderno (web y móvil) que automatice el proceso de recibir solicitudes de canciones con propinas durante eventos. El sistema permite al público enviar canciones a un DJ a través de una página web accesible por QR, realizar un pago mínimo (propina) y obtener confirmaciones del DJ sobre la reproducción.

**Estructura técnica solicitada:**
- Monorepo con enfoque inicial en Web, preparado para extender a Android/iOS.
- Web: Next.js / React
- Mobile: React Native (Expo) o Flutter
- Backend: Node.js (Express/NestJS) o Firebase Functions
- Base de datos: Firebase, Supabase o MongoDB
- Sistema de pagos: Cripto (WalletConnect/Metamask), transferencia bancaria manual
- Autenticación para administrador (JWT, Firebase Auth, etc.)

**Flujo de usuario (Frontend público):**
- Usuario escanea QR → abre la web del DJ
- Página muestra: nombre, bio, mensaje, formulario de solicitud
- Solicita: nombre de canción, artista, género, propina mínima, método de pago, evidencia de pago, @Telegram (opcional)
- Mensaje de confirmación tras enviar

**Panel de administración (DJ):**
- Acceso privado con login seguro
- Cola de solicitudes ordenadas por propina
- Historial de canciones reproducidas
- Verificación y confirmación manual de pagos
- Lógica automática de prioridad por monto

**Extras sugeridos:**
- Notificaciones automáticas por Telegram o web
- Perfil personalizable del DJ
- Preparado para multi-evento/multi-DJ

## Tecnologías utilizadas
- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS
- Supabase (DB y auth)
- Stripe y Coinbase (pagos)

## Propósito y características principales
- Automatizar y priorizar solicitudes de canciones con propinas
- Web pública lista para producción
- Panel de administración funcional
- Backend/API + conexión a base de datos
- Función para verificar propinas y ordenarlas por prioridad
- Instrucciones para desplegar (Vercel, Firebase, etc.)

## Estructura de carpetas (Árbol detallado)

```
Djwacko_propinas_web_monorepo/
├── .env
├── admin/
│   ├── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   ├── dj-hero-bg.jpg
│   │   │   ├── dj-wacko-logo-text.png
│   │   │   ├── dj-wacko-main-logo.jpg
│   │   │   └── images.d.ts
│   │   ├── index.css
│   │   ├── Index.tsx
│   │   ├── main.tsx
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   │   └── ui/ (componentes shadcn-ui)
│   ├── hooks/
│   ├── integrations/
│   │   └── supabase/
│   ├── lib/
│   ├── pages/
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   ├── config.toml
│   ├── functions/
│   └── migrations/
│       └── 20250719041337-fc6bd801-6b8d-4482-a9a0-6ac3b2ececed.sql
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── ...otros archivos
```

## Cómo editar y desplegar

1. Clona el repositorio:
```sh
git clone <TU_GIT_URL>
cd Djwacko_propinas_web_monorepo
```
2. Instala dependencias:
```sh
npm install
```
3. Inicia el servidor de desarrollo:
```sh
npm run dev
```
4. Genera el build de producción:
```sh
npm run build
```

---

## Checklist de funcionalidades implementadas (julio 2025)

- [x] Validación de contraseñas seguras (8+ caracteres, mayúscula, número, carácter especial)
- [x] Términos de uso obligatorios con enlace a página de términos
- [x] Opción de eliminar cuenta con advertencia clara y limpieza total de datos
- [x] Limpieza completa del estado de autenticación
- [x] Políticas de privacidad actualizadas y requisitos de contraseña segura
- [x] Información sobre no almacenar datos sensibles fuera del servicio
- [x] Panel de administración mejorado con pestaña "Usuarios" y usuarios en línea (últimos 30 min)
- [x] Información completa del usuario (nombre, email, teléfono, apodo)
- [x] Detección de usuarios activos
- [x] Historial y favoritos funcionales, con reordenamiento desde historial
- [x] Eliminación de cuenta con confirmación y limpieza total
- [x] Autenticación actualizada con campos adicionales (nombre, teléfono, apodo) y animaciones sutiles
- [x] Página de historial con dos pestañas: "Mi Historial" y "Mis Favoritos"
- [x] Guardar/eliminar canciones y reordenar desde historial
- [x] Integración con pagos (Stripe y cripto) con validación de mínimo $2 USD/2 USDC
- [x] Botones de pago animados: gradientes, hover, escala, sombra, pulse
- [x] Modal de términos elegante y animado, aceptación obligatoria
- [x] Email oculto en admin
- [x] Géneros expandidos y opción "Otros" con campo personalizable
- [x] Imágenes y assets verificados, sin enlaces rotos
```

Puedes editar archivos en tu IDE favorito o directamente en GitHub. El despliegue puede hacerse en Vercel, Firebase, etc.

---

> Si tienes dudas o necesitas personalización, consulta el contexto y los objetivos al inicio de este archivo.
