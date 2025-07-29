# Proyecto DJ Wacko - Plataforma de Solicitudes Musicales

## Estado del Proyecto (Julio 2025)

El proyecto ha pasado por una fase de estabilización y refactorización para mejorar su mantenibilidad y corregir errores. Los cambios clave incluyen:

-   **Corrección de Bugs Críticos:** Se ha solucionado un error de compilación causado por una ruta de importación incorrecta después de la reorganización de carpetas.
-   **Refactorización de Carpetas:** Se han consolidado los componentes de administración en una única carpeta (`src/components/admin-components`) para eliminar duplicados y mejorar la claridad de la estructura del proyecto.
-   **Solución de Errores de UI:** Se corrigieron varios bugs visuales, como contenido duplicado, imágenes rotas y advertencias en la consola de React.
-   **Configuración del Entorno:** Se ha mejorado la configuración de VS Code para que sea compatible con las funciones de Supabase (Deno), eliminando falsos errores de TypeScript.

El proyecto se encuentra ahora en un estado estable y listo para continuar con el desarrollo de nuevas funcionalidades.

-   **Sistema de Administración Restaurado:** Se reparó el historial de migraciones de Supabase, permitiendo la correcta aplicación del sistema de roles y restaurando el acceso al panel de administración.

Bienvenido a la plataforma interactiva de DJ Wacko. Esta aplicación permite a los usuarios solicitar canciones, enviar propinas y mantenerse al día con los eventos del artista.

## ¿Cómo funciona?

1. **Solicita tu Canción:** Usa el formulario para buscar y enviar la canción que quieres escuchar.
2. **Muestra tu Apoyo:** ¿Quieres que tu canción suene antes? ¡Puedes añadir una propina para que el DJ le dé prioridad!
3. **Mantente Conectado:** Revisa las próximas fechas y eventos de DJ Wacko.

¡Disfruta de la música!

## ✨ Últimas Mejoras

### Refactorización de Componentes (Enero 2025)
- **Index.tsx**: Dividido en componentes modulares (`Header`, `MainContent`, `Footer`)
- **UserHistory.tsx**: Refactorizado con custom hook `useUserHistory` y componentes especializados
- **Arquitectura Mejorada**: Separación clara entre lógica de negocio y presentación
- **Mantenibilidad**: Código más limpio, legible y fácil de mantener

## 🛠️ Tecnologías y Versiones

### Frontend
- **React** `^18.3.1` - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** `^5.5.3` - Superset tipado de JavaScript
- **Vite** `^7.0.6` - Herramienta de build rápida
- **Tailwind CSS** `^3.4.11` - Framework de CSS utilitario
- **React Router DOM** `^6.26.2` - Enrutamiento para React

### UI Components
- **shadcn/ui** - Componentes de UI basados en Radix UI
- **Radix UI** `^1.x.x` - Primitivos de UI accesibles
- **Lucide React** `^0.462.0` - Iconos SVG
- **Framer Motion** `^12.23.9` - Animaciones
- **Sonner** `^1.5.0` - Notificaciones toast

### Backend & Database
- **Supabase** `^2.52.0` - Backend as a Service
- **PostgreSQL** - Base de datos relacional
- **Row Level Security (RLS)** - Seguridad a nivel de fila

### Estado y Formularios
- **TanStack Query** `^5.56.2` - Gestión de estado del servidor
- **React Hook Form** `^7.53.0` - Gestión de formularios
- **Zod** `^3.23.8` - Validación de esquemas

### Mobile (Capacitor)
- **Capacitor** `^7.4.2` - Framework híbrido para apps nativas
- **Android** - Plataforma móvil soportada

### Testing
- **Vitest** `^3.2.4` - Framework de testing
- **Testing Library** `^15.0.7` - Utilidades de testing para React
- **jsdom** `^24.1.3` - Implementación de DOM para testing

## 📱 Información de la APK

- **Versión:** 1.0.0
- **Plataforma:** Android
- **Arquitectura:** Híbrida (Capacitor + React)
- **Tamaño mínimo:** Android 7.0 (API level 24)
- **Permisos:** Internet, Almacenamiento

## Guía para Desarrolladores

Para información técnica, configuración del proyecto y detalles de la arquitectura, por favor consulta la guía para desarrolladores.

➡️ **[Consulta la Guía para Desarrolladores (DEVELOPER_GUIDE.md)](./DEVELOPER_GUIDE.md)**

---

## 👨‍💻 Desarrollador

**Ing. Juan Carlos Mendez N. (wacko)**

### Derechos de Autor

© 2025 DJ Wacko Platform. Todos los derechos reservados.

Este proyecto ha sido desarrollado por el Ing. Juan Carlos Mendez N. (wacko) como una plataforma interactiva para solicitudes musicales y gestión de eventos de DJ.

### Licencia

Este software es propiedad del desarrollador. El uso, distribución o modificación requiere autorización expresa del autor.

### Contacto

Para consultas técnicas, soporte o colaboraciones, contacta al desarrollador a través de los canales oficiales de DJ Wacko.

---

*Desarrollado con ❤️ para la comunidad musical*


### Estructura de Directorios

```
src/
├── components/
│   ├── admin/            # Componentes específicos del panel de administración
│   ├── admin-components/ # Componentes del dashboard administrativo
│   ├── auth-components/  # Componentes de autenticación (Login, Register)
│   ├── custom/           # Componentes personalizados (LoadingScreen, WelcomeModal)
│   ├── history-page/     # Componentes de la página de historial (refactorizado)
│   │   ├── HistoryTabs.tsx
│   │   ├── RequestList.tsx
│   │   ├── SavedList.tsx
│   │   ├── RequestItem.tsx
│   │   ├── SavedItem.tsx
│   │   └── HistoryEmptyState.tsx
│   ├── layout/           # Componentes de layout (Header, Footer, ProtectedRoute)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── ProtectedRoute.tsx
│   ├── page-components/  # Componentes específicos de páginas
│   │   ├── MainContent.tsx
│   │   ├── PaymentDialog.tsx
│   │   ├── SongRequestForm.tsx
│   │   ├── WelcomeModal.tsx
│   │   └── index.ts
│   └── ui/              # Componentes base de shadcn/ui (51 componentes)
├── hooks/               # Custom hooks
│   ├── use-mobile.tsx   # Hook para detectar dispositivos móviles
│   ├── use-toast.ts     # Hook para notificaciones toast
│   └── useUserHistory.ts # Hook personalizado para lógica de historial
├── integrations/        # Integraciones externas
│   └── supabase/        # Configuración y cliente de Supabase
├── lib/                 # Utilidades y configuraciones
├── pages/               # Páginas principales de la aplicación
│   ├── Admin.tsx        # Panel de administración
│   ├── Auth.tsx         # Página de autenticación
│   ├── Index.tsx        # Página principal (refactorizada)
│   ├── NotFound.tsx     # Página 404
│   ├── Terms.tsx        # Términos y condiciones
│   └── UserHistory.tsx  # Historial de usuario (refactorizada)
├── types/               # Definiciones de tipos TypeScript
│   ├── database.types.ts # Tipos generados de Supabase
│   ├── index.ts         # Exportaciones de tipos
│   └── react-custom-es.d.ts # Tipos personalizados
├── assets/              # Recursos estáticos (imágenes, logos)
├── App.tsx              # Componente raíz de la aplicación
├── main.tsx             # Punto de entrada de la aplicación
├── index.css            # Estilos globales con Tailwind CSS
└── vite-env.d.ts        # Tipos de entorno para Vite
```
