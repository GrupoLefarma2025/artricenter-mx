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
- Tailwind v4 se configura **CSS-first** dentro de `src/styles/global.css` (`@import "tailwindcss"`) a través del plugin `@tailwindcss/vite`. **No existe `tailwind.config.mjs`** (v4 no lo necesita).
- El despliegue es **100% por FTP** sobre un hosting Apache (ver §7). No hay adapter SSR (`@astrojs/vercel` ni ningún otro).

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
npm run img:avif   # Convierte una imagen a AVIF (ver §8). Uso: npm run img:avif -- <in> <out> [ancho]
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
├── scripts/                    # Scripts Node (to-avif.mjs → conversión AVIF)
├── astro.config.mjs            # Configuración de Astro (static + sitemap + Tailwind)
├── tsconfig.json               # TS strict + alias @/*
├── .htaccess                   # Reglas Apache (HTTPS, caché, 301 legacy)
├── deploy.py / deploy_ftp.py   # Scripts de despliegue por FTP
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

El sitio usa **Tailwind v4 (CSS-first)** para el 90% del estilizado, más una capa mínima de CSS global y tres colores de marca aplicados inline. No hay capa de design tokens (`@theme` ni variables CSS): los colores de marca viven como literales `rgb()` en el markup.

#### Paleta de marca

| Token | RGB | Hex | Uso canónico |
|---|---|---|---|
| Azul primario | `rgb(0, 83, 161)` | `#0053A1` | Color principal. Headings (`h2`/`h3`), bordes, gradientes, meta `theme-color`, sucursal **La Raza** |
| Verde | `rgb(83, 175, 49)` | `#53AF31` | Acento secundario. Sucursal **Atizapán**, categoría _Nutrición_ |
| Naranja | `rgb(242, 144, 88)` | `#F29058` | Acento cálido. Sucursal **Viaducto**, categoría _Salud_ |

Aplicación: **inline** (`style="color: rgb(0, 83, 161)"`), no clases Tailwind — ver `src/pages/blog.astro` y `src/components/sections/Sucursales.astro`. Regla: reutiliza estos tres RGB; no inventes tonos nuevos de marca.

#### Colores funcionales (Tailwind, sin personalizar)

| Rol | Clases Tailwind | Dónde |
|---|---|---|
| WhatsApp / confirmación | `green-500` / `green-600` | CTA flotante derecho (`Layout.astro`) |
| Dra. Arce (consulta) | `pink-500` / `pink-600` | CTA flotante izquierdo + dropdown |
| Texto base / fondo | `text-gray-900` / `bg-white` | `<body>` en `Layout.astro` |
| Links y navegación | `blue-600` / `blue-700` | `Header.astro`, `Navigation.astro` |

#### Tipografía

- **Familia:** Atkinson Hyperlegible — self-hosted en `public/assets/fonts/` (4 TTF: Regular, Bold, Italic, BoldItalic). Elegida por legibilidad (diseñada para baja visión), coherente con un sitio clínico.
- **Pesos:** solo `400` (regular) y `700` (bold). No usar pesos intermedios.
- **Carga:** `font-display: swap` en cada `@font-face` (`global.css`) + `<link rel="preload">` del Regular en `Layout.astro` para evitar FOIT.
- Se aplica vía inline style en `<body>` (`font-family: 'Atkinson Hyperlegible', sans-serif`), **no** por una clase de Tailwind.

#### Movimiento y microinteracciones

- **`.cta-attn`** (`global.css`): animación periódica (wiggle + glow) en los CTA flotantes para atraer la atención **sin** movimiento constante. Se compone de dos keyframes: `cta-attn` (5.5s) y `cta-glow` (2.4s).
- **`--cta-glow`**: variable CSS por botón para el color del glow (ej. el CTA de WhatsApp la setea en `rgba(34, 197, 94, 0.6)`).
- **Accesibilidad:** se respeta `@media (prefers-reduced-motion: reduce)` → desactiva `.cta-attn`.
- **Smooth scroll:** `scroll-behavior: smooth` (global) + handler JS en `Layout.astro` para anclas `#`.

#### Layout y estructura visual

- **Offset de anclas:** `scroll-padding-top: 5rem` compensa el header sticky al navegar a `#secciones`.
- **Header:** sticky a `top:0; z-index:9999`. Dos capas — el logo desktop **no** es sticky (se desplaza), la barra de navegación sí; en móvil el header completo es sticky. Un _logo mini_ aparece al hacer scroll (`Header.astro`).
- **CTAs flotantes:** contenedor `fixed bottom-0` con dos anclas — Dra. Arce (izq) y WhatsApp (der). Cada uno tiene variante _mobile compact_ / _desktop full_ separada por el breakpoint `sm:`.
- **Textura papel:** overlay SVG `fractalNoise` al 3% de opacidad con `mix-blend-mode: multiply`, declarado en `Layout.astro` (`fixed`, `pointer-events-none`). Es decorativa.

#### Convenciones de Tailwind v4

- **Utility-first:** estiliza con clases en el markup; evita CSS suelto.
- **CSS global** _solo_ en `src/styles/global.css` (`@font-face`, `scroll-*`, fixes de `sticky`, keyframes de `.cta-attn`). No agregues hojas nuevas salvo necesidad real.
- **Estilos puntuales** de un componente → su bloque `<style>` (Astro aplica scope automático). Para apuntar a un ancestro global usa `:global(...)`.
- **No existe `tailwind.config.mjs`** — v4 se configura dentro del CSS.

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

---

## 8. Optimización de imágenes

Las imágenes se sirven en formatos modernos: **AVIF para fotos** y **WebP para logos/CTA**. Nunca PNG/JPEG pesados. La herramienta canónica es el script `scripts/to-avif.mjs` (usa `sharp`, ya en `devDependencies`).

```bash
# npm run img:avif -- <entrada> <salida> [ancho-opcional]
npm run img:avif -- public/assets/images/team/foto.jpg public/assets/images/team/foto.avif

# con downscale (recomendado si el origen supera ~1000px):
npm run img:avif -- entrada.jpg salida.avif 800
```

Preset del script: `quality: 55`, `effort: 6`. Ejemplo real: `dr-edith.jpg` (145 KB) → `dr-edith.avif` (38 KB).

Reglas:
- No subas un PNG/JPEG de 1500px si en pantalla se ve a 96px. Redimensiona al tamaño real de render (×2 para retina); el argumento `ancho` del script hace el downscale.
- Tras convertir, **borra el original pesado** y actualiza las referencias en `src/` (`.jpg`/`.png` → `.avif`/`.webp`).
- Mantén el `.jpeg` original **solo** donde una URL pública externa lo exija (ej. el `logo` del JSON-LD en `Layout.astro`, que apunta a `brand/logo.jpeg`).

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

## Licencia

Proyecto privado de Artricenter. Todos los derechos reservados.
