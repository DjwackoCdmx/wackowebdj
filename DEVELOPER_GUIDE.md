# Guía para Desarrolladores - Plataforma DJ Wacko

Esta guía documenta la estructura del proyecto, las decisiones clave de desarrollo y los procedimientos para mantener y extender la aplicación.

## 1. Estructura de Carpetas Clave

El proyecto sigue una estructura organizada para separar las preocupaciones y facilitar la mantenibilidad.

-   `src/`
    -   `assets/`: Imágenes, GIFs y otros recursos estáticos.
    -   `components/`: Componentes de React reutilizables.
        -   `ui/`: Componentes base de ShadCN (Button, Card, etc.). **No modificar directamente.**
        -   `layout/`: Componentes estructurales (Header, Footer, LoadingScreen, ProtectedRoute).
        -   `page-components/`: Componentes complejos específicos de una página (e.g., `SongRequestForm`, `WelcomeModal`).
        -   `admin-components/`: Componentes exclusivos para el panel de administración. (Carpeta `admin` fue consolidada aquí).
        -   `auth-components/`: Componentes para las páginas de autenticación.
    -   `hooks/`: Hooks de React personalizados (e.g., `use-toast`).
    -   `integrations/`: Clientes y configuraciones para servicios externos (e.g., Supabase).
    -   `pages/`: Componentes que representan páginas completas y se asocian a rutas.
    -   `types/`: Definiciones de tipos de TypeScript globales.
-   `supabase/`
    -   `functions/`: Funciones Edge de Supabase escritas en Deno.

## 2. Configuración del Entorno de Desarrollo

### Prerrequisitos
-   Node.js (v18+)
-   pnpm (o npm/yarn)
-   Extensión de VS Code: `Tailwind CSS IntelliSense`
-   Extensión de VS Code: `Deno`

### Configuración de VS Code (`.vscode/settings.json`)

Para asegurar que el editor de código entienda tanto la sintaxis de Tailwind CSS como la de Deno (para las funciones de Supabase), el archivo `.vscode/settings.json` ha sido configurado para habilitar el linter de Deno específicamente en la carpeta `supabase/functions`. Esto resuelve los errores de importación de módulos por URL y el reconocimiento de APIs de Deno.

## 3. Resumen de Cambios Recientes (Julio 2025)

Se realizó una sesión de estabilización y refactorización que abordó los siguientes puntos:

-   **Refactorización de Carpetas:** Se consolidó la carpeta duplicada `src/components/admin` dentro de `src/components/admin-components` para mantener una estructura de proyecto limpia y consistente.
-   **Corrección de Rutas:** Se verificó y completó el enrutador principal en `App.tsx`, asegurando que todas las páginas, incluida la ruta protegida `/admin`, estén correctamente registradas.
-   **Solución de Bugs de UI:**
    -   Se eliminó el contenido duplicado en la página principal (`Index.tsx`).
    -   Se corrigió la ruta de la imagen rota en el modal de bienvenida (`WelcomeModal.tsx`).
    -   Se solucionó la advertencia de `key` duplicada en el formulario de solicitud de canciones (`SongRequestForm.tsx`).
    -   Se habilitó el enlace a "Términos y Condiciones" registrando su ruta.
-   **Configuración del Editor:** Se ajustó `settings.json` para proporcionar IntelliSense correcto para las funciones de Supabase (Deno), eliminando falsos positivos de errores de TypeScript.

Este documento contiene toda la información técnica necesaria para entender, mantener y extender el proyecto.

## 🚀 Pila Tecnológica (Tech Stack)

- **Framework:** Next.js (con React 18)
- **Lenguaje:** TypeScript
- **UI:** shadcn/ui sobre Radix UI y Tailwind CSS
- **Backend & Autenticación:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Herramientas de Build:** Vite

## ⚙️ Configuración del Entorno Local

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Prerrequisitos

- Node.js (v18 o superior)
- pnpm (o npm/yarn)
- Una cuenta de Supabase y la CLI de Supabase instalada.

### 2. Instalación

1. **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2. **Instala las dependencias:**

    ```bash
    pnpm install
    ```

### 3. Configuración de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto.
2. Añade las credenciales de tu proyecto de Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=URL_DE_TU_PROYECTO_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_LLAVE_ANONIMA_DE_SUPABASE
    ```

### 4. Ejecuta el Proyecto

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🔧 Arquitectura del Backend (Supabase)

El proyecto depende de dos funciones RPC clave en Supabase para la lógica de negocio:

- `is_admin()`: Verifica si el usuario autenticado tiene el rol de administrador. Se basa en Row Level Security (RLS) para ser segura.
- `is_request_time_allowed()`: Devuelve `true` o `false` para controlar si el formulario de solicitudes está activo. Esto permite al DJ controlar el flujo de solicitudes durante un evento.

## ⚠️ Solución de Problemas (Troubleshooting)

### Error de Tipado en `supabase.rpc()`

Durante el desarrollo, se encontró un error de compilación persistente (`TS2345`) donde TypeScript no reconocía la función RPC `is_admin` como un argumento válido.

**Causa:** Los tipos autogenerados por la CLI de Supabase (`supabase gen types`) no se actualizaron correctamente para incluir todas las funciones RPC disponibles, limitando la verificación de tipos a una sola función.

**Solución Implementada:**

Para resolver el bloqueo de compilación, se aplicó una solución controlada en `src/pages/Index.tsx`:

1. **Aserción de Tipo (`as any`):** Se fuerza a TypeScript a ignorar el error de tipado en la llamada `supabase.rpc('is_admin')`.
2. **Desactivación de ESLint:** Se añade un comentario `// eslint-disable-next-line @typescript-eslint/no-explicit-any` para silenciar la advertencia de calidad de código sobre el uso de `any` en esa línea específica.

```typescript
// HACK: Using 'as any' to bypass incorrect Supabase type generation.
// The long-term fix is to regenerate Supabase types correctly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data, error } = await supabase.rpc('is_admin' as any);
```

**Solución a Largo Plazo:**

Para evitar este problema en el futuro, se debe regenerar el archivo de tipos de Supabase después de cada cambio en el esquema de la base de datos o en las funciones RPC. Ejecuta el siguiente comando:

```bash
pnpm supabase gen types --local > src/types/supabase.ts
```

## 🏗️ Arquitectura de Componentes

### Refactorización Reciente (Enero 2025)

El proyecto ha sido significativamente refactorizado para mejorar la mantenibilidad y escalabilidad:

#### Index.tsx - Página Principal

**Antes:** Un componente monolítico de 200+ líneas con toda la lógica y UI mezclada.

**Después:** Dividido en componentes especializados:

- `src/components/layout/Header.tsx` - Encabezado con navegación y autenticación
- `src/components/page-components/MainContent.tsx` - Contenido principal y formulario
- `src/components/layout/Footer.tsx` - Pie de página con enlaces

#### UserHistory.tsx - Página de Historial

**Antes:** Un componente complejo con lógica de estado, llamadas a API y renderizado mezclados.

**Después:** Arquitectura limpia con separación de responsabilidades:

- `src/hooks/useUserHistory.ts` - Custom hook con toda la lógica de negocio
- `src/components/history-page/HistoryTabs.tsx` - Navegación entre pestañas
- `src/components/history-page/RequestList.tsx` - Lista de solicitudes
- `src/components/history-page/SavedList.tsx` - Lista de canciones guardadas
- `src/components/history-page/RequestItem.tsx` - Tarjeta individual de solicitud
- `src/components/history-page/SavedItem.tsx` - Tarjeta individual de canción guardada
- `src/components/history-page/HistoryEmptyState.tsx` - Estados vacíos reutilizables

### Beneficios de la Refactorización

1. **Mantenibilidad:** Cada componente tiene una responsabilidad única
2. **Reutilización:** Los componentes pueden ser reutilizados en otras partes
3. **Testabilidad:** Componentes más pequeños son más fáciles de testear
4. **Legibilidad:** El código es más fácil de entender y navegar
5. **Escalabilidad:** Nuevas funcionalidades se pueden añadir sin afectar el código existente

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
