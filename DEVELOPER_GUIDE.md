# Guía para Desarrolladores - Plataforma DJ Wacko

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
│   ├── layout/           # Componentes de layout (Header, Footer)
│   ├── page-components/  # Componentes específicos de páginas
│   ├── history-page/     # Componentes de la página de historial
│   └── ui/              # Componentes base de shadcn/ui
├── hooks/               # Custom hooks
│   └── useUserHistory.ts
└── pages/               # Páginas principales
    ├── Index.tsx
    └── UserHistory.tsx
```
