# Sistema de Propinas para DJ "DJ Wacko" - v1.0

Este proyecto es una aplicación web moderna diseñada para que los DJs gestionen solicitudes de canciones y reciban propinas de manera digital durante sus eventos. El público puede escanear un código QR, acceder a la página, solicitar una canción y enviar una propina, todo desde su celular.

## Características Principales

### Vista Pública

- **Formulario de Solicitud:** Interfaz simple para que el público pida canciones, especifique el artista y envíe una propina.
- **Múltiples Métodos de Pago:** Integración con Stripe para pagos con tarjeta y Coinbase Commerce para criptomonedas.
- **Accesibilidad:** Diseño responsivo que funciona en cualquier dispositivo móvil.

### Panel de Administración (Exclusivo para el DJ)

- **Login Seguro:** Acceso protegido para la gestión del evento.
- **Cola de Solicitudes:** Las canciones solicitadas aparecen en una lista priorizada automáticamente por el monto de la propina.
- **Historial de Pagos:** Registro de todas las transacciones recibidas.
- **Gestión en Tiempo Real:** El DJ puede ver y gestionar las solicitudes a medida que llegan.

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
