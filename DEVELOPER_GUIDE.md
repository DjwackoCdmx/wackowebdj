# Guía para Desarrolladores - Proyecto DJ Wacko

**Última actualización:** 28 de Julio, 2025

## 1. Contexto del Proyecto

Este documento es la fuente de verdad para el desarrollo y mantenimiento de la aplicación web y móvil de DJ Wacko. El objetivo de este proyecto es proporcionar una plataforma interactiva para que los fans soliciten canciones, envíen propinas y se mantengan conectados con el artista.

La aplicación está construida como un monorepo que incluye:

- Un frontend web moderno desarrollado con **React (Vite) y TypeScript**.
- Componentes UI de alta calidad de **shadcn/ui** sobre **Tailwind CSS**.
- Un backend-as-a-service gestionado por **Supabase** (Autenticación, Base de Datos PostgreSQL).
- Integración de pagos a través de la API de **Coinbase Commerce**.
- Capacidades de aplicación móvil a través de **Capacitor**, generando un APK para Android.

## 2. Política Obligatoria de Documentación de Cambios

**Cualquier cambio, corrección de error o nueva característica implementada en este proyecto DEBE ser documentada en la sección `4. Registro de Cambios y Decisiones` de este archivo ANTES de hacer `commit` y `push` al repositorio.**

Esta regla no es negociable y su propósito es:

- **Prevenir la repetición de errores:** Entender qué se ha intentado y por qué falló.
- **Facilitar la incorporación:** Permitir que futuros desarrolladores entiendan la evolución del código.
- **Mantener la consistencia:** Asegurar que las decisiones de arquitectura se respeten y comprendan.

Cada entrada en el registro debe incluir:

- **Fecha:**
- **Componente(s) Afectado(s):**
- **Descripción del Problema/Cambio:**
- **Solución Implementada:**
- **Desarrollador:**

## 3. Estructura de Directorios (Árbol Principal)

```bash
Dj_propiona_eb/
├── android/          # Código nativo de Android (generado por Capacitor)
├── build/            # Archivos de compilación de Android
├── dist/             # Archivos de producción de la aplicación web
├── public/           # Archivos estáticos (imágenes, favicons)
├── src/              # ¡EL CORAZÓN DE LA APLICACIÓN!
│   ├── assets/       # Imágenes y logos específicos de la UI
│   ├── components/   # Componentes de React reutilizables
│   │   ├── custom/   # Componentes personalizados (ej. LoadingScreen)
│   │   └── ui/       # Componentes de shadcn/ui (Botones, Cards, etc.)
│   ├── hooks/        # Hooks de React personalizados (ej. use-toast)
│   ├── integrations/ # Lógica para conectar con servicios externos
│   │   └── supabase/ # Cliente y configuración de Supabase
│   ├── lib/          # Funciones de utilidad (ej. cn para clases CSS)
│   ├── pages/        # Componentes que representan páginas completas
│   │   ├── Admin.tsx
│   │   ├── Auth.tsx
│   │   ├── Index.tsx  (Página principal y núcleo de la lógica)
│   │   └── ...
│   ├── App.tsx       # Definición de rutas principales (Router)
│   └── main.tsx      # Punto de entrada de la aplicación React
├── supabase/         # Migraciones y configuración de la DB de Supabase
├── .env              # Variables de entorno (NUNCA SUBIR A GIT)
├── capacitor.config.ts # Configuración de Capacitor para la app móvil
├── package.json      # Dependencias y scripts del proyecto
├── README.md         # Guía para el usuario final
└── DEVELOPER_GUIDE.md # Esta guía
```

## 4. Registro de Cambios y Decisiones

---

- **Fecha:** 29 de Julio, 2025
- **Componente(s) Afectado(s):** `src/pages/Index.tsx`, `src/pages/Auth.tsx`
- **Descripción del Problema/Cambio:** Se necesitaba mejorar la experiencia de los nuevos usuarios y la accesibilidad de la información de contacto. La página principal solo tenía un botón de "Iniciar Sesión", lo que podía ser confuso para quienes deseaban registrarse. Además, la información de contacto (WhatsApp, Twitter) no estaba visible.
- **Solución Implementada:**
  1. En `Index.tsx`, se reemplazó el botón único por dos botones distintos: "Iniciar Sesión" y "Registrarse".
  2. Se añadió una sección de contacto prominente con enlaces directos a WhatsApp y Twitter, utilizando iconos para mejorar la visibilidad.
  3. En `Auth.tsx`, se implementó lógica para detectar el estado de navegación, permitiendo que el clic en "Registrarse" lleve directamente al formulario de registro, creando un flujo de usuario más intuitivo.
- **Desarrollador:** Cascade (asistente de IA)

---

- **Fecha:** 29 de Julio, 2025
- **Componente(s) Afectado(s):** `src/pages/Index.tsx`, `src/pages/Auth.tsx`
- **Descripción del Problema/Cambio:** Se necesitaba mejorar la experiencia de los nuevos usuarios y la accesibilidad de la información de contacto. La página principal solo tenía un botón de "Iniciar Sesión", lo que podía ser confuso para quienes deseaban registrarse. Además, la información de contacto (WhatsApp, Twitter) no estaba visible.
- **Solución Implementada:**
  1. En `Index.tsx`, se reemplazó el botón único por dos botones distintos: "Iniciar Sesión" y "Registrarse".
  2. Se añadió una sección de contacto prominente con enlaces directos a WhatsApp y Twitter, utilizando iconos para mejorar la visibilidad.
  3. En `Auth.tsx`, se implementó lógica para detectar el estado de navegación, permitiendo que el clic en "Registrarse" lleve directamente al formulario de registro, creando un flujo de usuario más intuitivo.
- **Desarrollador:** Cascade (asistente de IA)

---

- **Fecha:** 28 de Julio, 2025
- **Componente(s) Afectado(s):** `src/App.tsx`, `src/pages/Index.tsx`
- **Descripción del Problema/Cambio:** Se presentó un bug crítico y persistente donde la UI (botón de admin, modal de bienvenida) se renderizaba de forma inconsistente. A veces los elementos aparecían correctamente y a veces no. La causa raíz era una **condición de carrera**: la aplicación se renderizaba antes de que la llamada asíncrona a Supabase para verificar la sesión del usuario hubiera terminado.
- **Solución Implementada:** Se re-arquitecturó la gestión de estado siguiendo el patrón de un respaldo funcional. **Se eliminó toda la lógica de estado de `App.tsx`**, convirtiéndolo en un componente simple que solo define rutas. **Toda la responsabilidad de la autenticación** (obtener sesión, manejar estado de carga, verificar si es admin) **se consolidó dentro de `Index.tsx`**. Ahora, `Index.tsx` es autónomo: muestra una pantalla de carga mientras verifica la sesión y solo después renderiza la UI principal, eliminando por completo la condición de carrera.
- **Desarrollador:** Cascade (asistente de IA)

---
