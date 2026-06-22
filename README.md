# Artricenter

Sitio web **estático** de Artricenter, clínica especializada en el diagnóstico y tratamiento integral de enfermedades reumáticas en Ciudad de México.

Producción: <https://artricenter.com.mx>

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Framework | [Astro](https://astro.build/) | `^7.0.0` | `output: 'static'` (SSG, sin servidor) |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) | `^4.2.2` | v4 **CSS-first** vía `@tailwindcss/vite` |
| Lenguaje | TypeScript | strict | extiende `astro/tsconfigs/strict` |
| Tests | [Vitest](https://vitest.dev/) | `^4.1.0` | unit tests |
| Runtime | Node.js | `>=22.12.0` | ver `engines` en `package.json` |
| Gestor de paquetes | npm | — | usar `package-lock.json` (no pnpm/yarn) |
| Sitemap | `@astrojs/sitemap` | `^3.7.3` | genera `sitemap-*.xml` en build |

**Decisiones importantes:**

- El sitio es **100% estático**. No hay servidor en runtime: todo se resuelve en `astro build` y se sirve como HTML/CSS/JS plano.
- El contenido del **blog se obtiene en _build time_** desde una API externa (ver §6). Si la API cambia o no responde, hay que reconstruir el sitio.
- Tailwind v4 **no usa `tailwind.config.mjs`** para escanear clases; el archivo presente es vestigial (heredado de v3) y puede eliminarse. La configuración real de Tailwind v4 vive en `src/styles/global.css` con `@import "tailwindcss";`.
- `@astrojs/vercel` está en `dependencies` pero **NO está conectado** en `astro.config.mjs`. El despliegue real es por **FTP** (ver §7). Esa dependencia es removible.

---

## 2. Puesta en marcha

```bash
# 1. Requisito: Node.js >= 22.12.0
node --version

# 2. Instalar dependencias (usa el lockfile)
npm ci          # o npm install

# 3. Variables de entorno
cp .env.example .env
#   Edita .env y completa PUBLIC_API_URL (y credenciales FTP si harás deploy)

# 4. Servidor de desarrollo -> http://localhost:4321
npm run dev
```

---

## 3. Scripts

```bash
npm run dev        # Servidor de desarrollo con hot reload
npm run build      # Genera el sitio estático en dist/
npm run preview    # Sirve dist/ localmente para revisar la build
npm run test       # Ejecuta los tests con Vitest
npm run astro      # CLI de Astro (astro add, astro check, etc.)
```

---

## 4. Estructura del proyecto

```
.
├── public/                     # Assets servidos tal cual (no pasan por el bundler)
│   └── assets/
│       ├── fonts/              # Atkinson Hyperlegible (TTF, self-hosted)
│       └── images/
│           ├── brand/          # Logo, favicon, OG image
│           ├── hero/           # Banners del carrusel (home)
│           ├── team/           # Fotos del equipo médico
│           ├── branches/       # Imágenes de sucursales
│           ├── specialties/    # Especialidades y tratamientos
│           └── texture/        # Texturas de fondo
├── src/
│   ├── components/
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── ui/                 # ContentSection, PageSection (genéricos)
│   │   └── sections/           # Bloques de página (Sucursales)
│   ├── config/                 # navigation.ts (menú) + tests
│   ├── data/                   # Datos estáticos tipados (branches.ts)
│   ├── layouts/                # Layout.astro (HTML base + <head> + SEO)
│   ├── lib/                    # blogApi.ts (cliente de la API del blog)
│   ├── pages/                  # Rutas (file-based routing)
│   └── styles/                 # global.css (Tailwind + fuentes + overrides)
├── tests/                      # Tests adicionales (seo-structure.test.js)
├── astro.config.mjs            # Configuración de Astro
├── tsconfig.json               # TS strict + alias @/*
├── .htaccess                   # Reglas Apache (HTTPS, caché, 301 legacy)
├── deploy.py / deploy_ftp.py   # Scripts de despliegue por FTP
├── fix-paths.js                # Post-build de rutas (actualmente no-op)
└── .env.example                # Plantilla de variables de entorno
```

---

## 5. Cómo programar (convenciones)

### Routing
- **File-based**: cada `.astro` en `src/pages/` es una ruta. `index.astro` → `/`, `contactanos.astro` → `/contactanos`.
- Rutas dinámicas con corchetes: `src/pages/blog/[slug].astro` → `/blog/:slug`. Al ser sitio estático, estas rutas se generan con `getStaticPaths()` en build time.

### Componentes
- Un componente = un archivo `.astro` con tres zonas: frontmatter (`---`), markup, y `<style>`/`<script>` opcionales.
- **Organización por responsabilidad:**
  - `components/layout/` → estructura global (header, footer, nav).
  - `components/ui/` → piezas genéricas y reutilizables.
  - `components/sections/` → bloques específicos de una página.
- Los datos NO se hardcodean en el markup: van tipados en `src/data/` (ej. `branches.ts`) y la navegación en `src/config/navigation.ts`.

### Imports y alias
- Alias `@/*` → `src/*` (definido en `tsconfig.json`). Usa `import { navConfig } from '@/config/navigation'` en vez de rutas relativas largas.

### TypeScript
- Modo **strict**. Tipa todo lo que cruce módulos: define `interface` para los datos (ver `Branch`, `NavItem`, `Post`).
- No uses `any`. Si la API externa trae snake_case, mapéalo a camelCase en una capa (ver `mapApiPost` en `blogApi.ts`).

### Estilos (guía de estilo)
- **Utility-first con Tailwind v4.** Estiliza con clases utilitarias en el markup; evita CSS suelto.
- CSS global **solo** en `src/styles/global.css` (fuentes, `scroll-behavior`, fixes de `sticky`). No agregues hojas de estilo nuevas salvo necesidad real.
- Estilos puntuales de un componente van en su bloque `<style>` (Astro los aísla con scope automático). Para apuntar a un ancestro global usa `:global(...)`.
- Tipografía del sitio: **Atkinson Hyperlegible** (alta legibilidad, self-hosted en `public/assets/fonts/`, `font-display: swap`).
- Paleta principal (de marca): azul `rgb(0, 83, 161)`, verde `rgb(83, 175, 49)`, naranja `rgb(242, 144, 88)`.

### Idioma
- **Contenido y textos de UI: español** (es un sitio clínico en México).
- **Código, identificadores, nombres de archivo, comentarios técnicos y commits: inglés.**

### Commits
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`…), en inglés, en presente imperativo.

---

## 6. Blog (API externa)

El blog **no** guarda contenido en el repo. `src/lib/blogApi.ts` consume una API REST:

- Configurada por `PUBLIC_API_URL` (variable de entorno, leída con `import.meta.env.PUBLIC_API_URL`).
- Endpoints usados:
  - `GET {PUBLIC_API_URL}/api/blog/posts?page=&pageSize=` → listado.
  - `GET {PUBLIC_API_URL}/api/blog/posts/{slug}` → post individual.
- El cliente normaliza la respuesta (snake_case → camelCase) en `mapApiPost`.

> Como el sitio es estático, los posts se traen **en build**. Para publicar contenido nuevo del blog hay que **reconstruir y redesplegar** el sitio.

---

## 7. Despliegue (FTP)

El sitio se construye y se sube por **FTP** a un hosting Apache. No hay CI/CD configurado: el deploy es manual.

```bash
# 1. Configurar credenciales (una sola vez)
cp .env.example .env
#    Completa FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR, LOCAL_DIST_DIR

# 2. Construir
npm run build           # genera dist/

# 3. Subir dist/ al servidor
python deploy.py        # FTP plano
#   o
python deploy_ftp.py    # variante alternativa
```

- `deploy.py` lee las credenciales de `.env`, recorre `dist/` y sube todo recursivamente.
- **`.htaccess`** (en la raíz del repo) debe estar también en la raíz del servidor. Define:
  - Redirección forzada a **HTTPS** y al dominio canónico.
  - Cabeceras **no-cache** (para purgar caché del navegador).
  - Redirecciones **301 legacy** de URLs antiguas.
- `fix-paths.js` es un post-build de rutas que **hoy no hace nada** (el sitio vive en la raíz `/`). Existe por si en el futuro se sirve desde un subdirectorio.

---

## 8. Optimización de imágenes (obligatorio mantener)

Las imágenes deben servirse en **WebP o AVIF**, no PNG/JPEG, para reducir el peso de carga. Hay `sharp` disponible (viene con Astro) para convertir.

Ejemplo de conversión de un asset a WebP:

```bash
node -e "require('sharp')('public/assets/images/ruta/origen.png')
  .resize({ height: 240 })           // ajusta al tamaño real de render (retina ~2x)
  .webp({ quality: 82 })
  .toFile('public/assets/images/ruta/origen.webp')
  .then(i => console.log((i.size/1024).toFixed(1)+'KB'))"
```

Reglas:
- No subas un PNG/JPEG de 1500px si en pantalla se ve a 96px. Redimensiona al tamaño real (×2 para retina).
- Tras convertir, actualiza las referencias en `src/` (`.png`/`.jpeg` → `.webp`).
- Mantén el `.jpeg` original solo donde una URL pública externa lo exija (ej. el `logo` en el JSON-LD de `Layout.astro`).

---

## 9. Tests

```bash
npm run test
```

- `src/config/__tests__/navigation.test.ts` → valida la estructura del menú.
- `tests/seo-structure.test.js` → valida estructura SEO.
- Al tocar `navigation.ts` o la estructura de páginas, corre los tests antes de commitear.

---

## 10. SEO

- `src/layouts/Layout.astro` centraliza `<head>`: meta tags, Open Graph, Twitter Card y **JSON-LD** (schema.org).
- El sitemap se genera automáticamente en build (`@astrojs/sitemap`).
- `site: 'https://artricenter.com.mx'` en `astro.config.mjs` es la base para URLs absolutas y sitemap.

---

## 11. Seguridad

- `.env` está en `.gitignore`. **Nunca** subas credenciales (FTP, API) al repositorio.
- Para rotar la contraseña FTP: actualízala en el `.env` local y en el panel del hosting.
- Variables `PUBLIC_*` se exponen al cliente en el bundle: no pongas secretos ahí, solo URLs públicas.

---

## 12. Deuda técnica conocida

- `tailwind.config.mjs`: vestigial de Tailwind v3, no lo usa v4. Eliminable.
- `@astrojs/vercel`: instalado pero no conectado en `astro.config.mjs`. Eliminable si se confirma que el deploy seguirá siendo FTP.
- `fix-paths.js`: actualmente no-op.
- Existen assets sin referenciar en `public/assets/images/` (ej. logos legacy). Limpiar con cuidado, verificando que ninguna página los use.

---

## Licencia

Proyecto privado de Artricenter. Todos los derechos reservados.
