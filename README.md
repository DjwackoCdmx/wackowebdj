# Proyecto DJ Wacko - Plataforma de Solicitudes Musicales

Bienvenido a la plataforma interactiva de DJ Wacko. Esta aplicación permite a los usuarios solicitar canciones, enviar propinas y mantenerse al día con los eventos del artista.

## Características Principales

### Funcionalidades

* **Solicitudes de Canciones en Tiempo Real:** Envía tus canciones favoritas directamente al DJ durante sus sets en vivo.
* **Sistema de Propinas Integrado:** Apoya al artista con una propina al momento de hacer tu solicitud.
* **Panel de Administración:** Una vista exclusiva para que el DJ gestione las solicitudes, controle el flujo de la música y visualice el historial.
* **Autenticación Segura y Sencilla:** Un flujo de registro e inicio de sesión claro y directo para guardar tu historial y acceder a funciones personalizadas.
* **Diseño Moderno y Responsivo:** Disfruta de una experiencia de usuario fluida en cualquier dispositivo, ya sea de escritorio o móvil.

## Tecnologías Utilizadas

### Frontend

* **React 18:** Para una interfaz de usuario dinámica y reactiva.
* **TypeScript:** Para un código más robusto y seguro.
* **Vite:** Como herramienta de construcción y servidor de desarrollo ultrarrápido.
* **Tailwind CSS:** Para un diseño estilizado y personalizable.
* **shadcn/ui:** Una colección de componentes de UI reutilizables y accesibles.

### Backend & Base de Datos

* **Supabase:** La plataforma de backend como servicio que proporciona base de datos, autenticación y APIs.

### Despliegue

* **Vercel/Netlify:** Plataformas optimizadas para el despliegue de aplicaciones frontend modernas.

## Cómo Empezar

### Prerrequisitos

* Node.js (versión 18 o superior)
* npm o pnpm
* Una cuenta de Supabase

### Instalación

1. **Clona el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/Dj_propiona_eb.git
    cd Dj_propiona_eb
    ```

2. **Instala las dependencias:**

    ```bash
    npm install
    # o si usas pnpm
    pnpm install
    ```

3. **Configura las variables de entorno:**

    * Crea un archivo `.env` en la raíz del proyecto.
    * Añade tus claves de Supabase como se muestra en el archivo `.env.example`:

        ```env
        VITE_SUPABASE_URL=tu-url-de-supabase
        VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
        ```

### Ejecución

* **Para desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

* **Para producción:**

    ```bash
    npm run build
    npm run preview
    ```

## Estructura del Proyecto

```text
Dj_propiona_eb/
├── public/           # Archivos estáticos
├── src/
│   ├── components/     # Componentes de UI reutilizables
│   ├── pages/          # Páginas de la aplicación (rutas)
│   ├── lib/            # Funciones de utilidad (ej. cliente Supabase)
│   ├── styles/         # Estilos globales
│   └── main.tsx        # Punto de entrada de la aplicación
├── .env.example      # Ejemplo de variables de entorno
├── package.json
└── vite.config.ts    # Configuración de Vite
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar la aplicación, por favor abre un *issue* para discutir los cambios o envía un *pull request*.

## REPORTE DE AUDITORÍA

### RESUMEN EJECUTIVO

* ✅ **Estado General:** PROYECTO LISTO PARA PRODUCCIÓN
* ✅ **Errores Críticos:** CORREGIDOS
* ✅ **Compatibilidad:** MEJORADA PARA CHROME Y OTROS NAVEGADORES
* ✅ **Componentes UI:** TODOS AUDITADOS Y APROBADOS

### CONCLUSIÓN

El proyecto **Dj_propiona_eb** está en excelente estado técnico, sin errores bloqueantes, con código limpio y bien estructurado. La compatibilidad con Chrome y otros navegadores ha sido mejorada significativamente. Todos los componentes UI están correctamente implementados y siguen las mejores prácticas de React y TypeScript.

**ESTADO FINAL: ✅ APROBADO PARA PRODUCCIÓN**

## Guía para Desarrolladores

Este proyecto tiene una documentación técnica detallada que es **de lectura obligatoria** antes de realizar cambios.

➡️ **[Consulta la Guía para Desarrolladores (DEVELOPER_GUIDE.md)](./DEVELOPER_GUIDE.md)**

## Proceso de Publicación de APK en GitHub

Para asegurar que el enlace de descarga directa de la aplicación siempre funcione, es crucial seguir estos pasos al crear una nueva "Release" en GitHub:

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
