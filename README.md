# Artricenter

Sitio web estático de Artricenter, clínica especializada en el diagnóstico y tratamiento integral de enfermedades reumáticas en Ciudad de México.

## Stack

- [Astro](https://astro.build/) 6.x
- [Tailwind CSS](https://tailwindcss.com/) 4.x
- TypeScript

## Estructura del proyecto

```
public/
  assets/
    fonts/              # Fuentes Atkinson Hyperlegible
    images/
      brand/            # Logo, favicon, OG image
      hero/             # Banners del carrusel
      team/             # Fotos del equipo médico
      branches/         # Logos de sucursales
      specialties/      # Imágenes de especialidades y tratamientos
      texture/          # Texturas de fondo
      testimonials/     # Fotos de testimonios
src/
  components/
    layout/             # Header, Footer, Navigation
    ui/                 # ContentSection, PageSection
    sections/           # Sucursales
  data/                 # Datos estáticos (sucursales)
  layouts/              # Layout principal
  lib/                  # Utilidades (blogApi)
  pages/                # Páginas del sitio
  styles/               # Estilos globales
  config/               # Configuración de navegación
```

## Scripts

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Construir el sitio
npm run build

# Vista previa de la build
npm run preview

# Ejecutar tests
npm run test
```

## Despliegue

El despliegue es manual mediante FTP. Los scripts `deploy.py` y `deploy_ftp.py` leen las credenciales desde un archivo `.env` (nunca lo subas al repositorio).

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Completa las credenciales reales en `.env`.

3. Construye el sitio:
   ```bash
   npm run build
   ```

4. Ejecuta el deploy:
   ```bash
   python deploy.py
   # o
   python deploy_ftp.py
   ```

## Notas de seguridad

- `.env` está ignorado en Git; nunca subas credenciales al repositorio.
- Si necesitas rotar la contraseña FTP, actualízala en `.env` local y en el servidor.

## Licencia

Proyecto privado de Artricenter.
