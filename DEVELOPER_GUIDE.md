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
