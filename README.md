# Proyecto DJ Wacko - Plataforma de Solicitudes Musicales

Bienvenido a la plataforma interactiva de DJ Wacko. Esta aplicación permite a los usuarios solicitar canciones, enviar propinas y mantenerse al día con los eventos del artista.

![DJ Wacko](src/assets/dj-wacko-main-logo.gif)

## ✨ Características Principales

- **Solicitudes en Tiempo Real:** Envía tus peticiones musicales directamente a la cabina del DJ.
- **Propinas Integradas:** Apoya al artista con propinas seguras a través de criptomonedas (vía Coinbase Commerce).
- **Sistema de Autenticación:** Crea tu cuenta para llevar un historial de tus solicitudes.
- **Panel de Administración:** Interfaz para que el DJ gestione las solicitudes y la configuración del evento.
- **Diseño Moderno y Adaptable:** Experiencia de usuario fluida en web y móvil.
- **Aplicación Android:** Descarga el APK para tener la experiencia nativa en tu dispositivo.

## 🚀 Cómo Empezar (Puesta en Marcha)

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/installation) como gestor de paquetes

### 1. Clonar el Repositorio

```bash
git clone https://github.com/DjwackoCdmx/wackowebdj.git
cd wackowebdj
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto copiando el contenido de `.env.example` (si existe) o añadiendo las siguientes claves de Supabase:

```
VITE_SUPABASE_URL=TU_URL_DE_SUPABASE
VITE_SUPABASE_ANON_KEY=TU_LLAVE_ANONIMA_DE_SUPABASE
```

### 4. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

## 🛠️ Para Desarrolladores

Este proyecto sigue una estricta política de documentación para asegurar su mantenibilidad y facilitar la colaboración.

**Toda la información técnica, arquitectura, estructura de directorios y registro de cambios se encuentra en la guía para desarrolladores.**

➡️ **[Consulta la Guía para Desarrolladores (DEVELOPER_GUIDE.md)](./DEVELOPER_GUIDE.md)**

Es **obligatorio** leer y seguir las directrices de este documento antes de realizar cualquier cambio en el código.

[![Descargar APK](https://img.shields.io/badge/Descargar-APK-brightgreen.svg)](https://github.com/DjwackoCdmx/wackowebdj/releases/latest/download/app-release.apk)

## Proceso de Publicación de APK en GitHub

Para asegurar que el enlace de descarga directa de la aplicación siempre funcione, es crucial seguir estos pasos al crear una nueva "Release" en GitHub:

1. **Generar el APK:** Compila y genera el archivo APK firmado desde Android Studio.
2. **Nombrar el Archivo:** Antes de subirlo, renombra el archivo APK a **`app-release.apk`**.
3. **Subir a GitHub:** Crea una nueva release en el repositorio y sube el archivo `app-release.apk` como un "asset" o activo.

**Importante:** El nombre del archivo debe ser exactamente `app-release.apk`. De lo contrario, el botón de descarga en la aplicación no funcionará.

## Tecnologías Utilizadas

- **Frontend:** React 18 + Vite + TypeScript
- **UI Framework:** shadcn-ui sobre Tailwind CSS
- **Backend & Base de Datos:** Supabase (Base de Datos PostgreSQL, Autenticación, Edge Functions)
- **Pasarelas de Pago:** Stripe y Coinbase Commerce
- **Hosting:** Vercel para despliegue continuo.
- **Aplicación Móvil (Android):** Compilada usando Capacitor.js.

## Estructura del Proyecto

El proyecto sigue una estructura de monorepo, separando la lógica del frontend, las funciones del backend y la configuración de la app móvil.

```bash
/
├── android/          # Código fuente de la App para Android
├── public/           # Archivos estáticos (íconos, APK)
├── src/              # Código fuente principal del frontend (React)
│   ├── components/   # Componentes reutilizables de la UI
│   ├── pages/        # Páginas principales (Index, Admin, etc.)
│   └── lib/          # Lógica auxiliar y configuración (Supabase, etc.)
├── supabase/
│   ├── functions/    # Edge Functions (lógica de pagos)
│   └── migrations/   # Migraciones de la base de datos
├── README.md         # Este archivo
└── package.json      # Dependencias y scripts
```

## Cómo Empezar

### Prerrequisitos

- Node.js (v18 o superior)
- pnpm (o npm/yarn)
- Tener una cuenta de Supabase, Stripe y Coinbase.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/DjwackoCdmx/wackowebdj.git
cd wackowebdj
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade tus claves de Supabase, Stripe y Coinbase. Puedes usar `.env.example` como plantilla.

### 4. Ejecutar el Proyecto

```bash
pnpm run dev
```

## Compilar la APK de Android

Para generar el archivo de instalación para Android, asegúrate de tener el entorno de Android Studio configurado y ejecuta:

```bash
cd android
./gradlew.bat assembleDebug
```

El archivo `.apk` se encontrará en `android/app/build/outputs/apk/debug/`.

## Próximos Pasos (Roadmap v2.0)

- [ ] **Tests Automatizados:** Implementar pruebas unitarias y de integración para las funciones de pago.
- [ ] **Panel de Admin Avanzado:** Añadir gráficas y estadísticas en tiempo real.
- [ ] **Notificaciones Push:** Notificar al DJ sobre nuevas propinas.
- [ ] **Internacionalización (i18n):** Permitir cambiar el idioma de la interfaz.
- [ ] **Progressive Web App (PWA):** Mejorar la experiencia móvil y permitir el uso offline.
- [ ] **Optimización SEO:** Mejorar el posicionamiento en buscadores.
