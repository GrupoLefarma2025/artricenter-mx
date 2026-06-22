import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { describe, it, expect, beforeAll } from 'vitest';

const pages = [
  'index',
  'especialidades',
  'tratamiento-medico-integral',
  'club-vida-y-salud',
  'contactanos'
];

describe('SEO structure checks', () => {
  beforeAll(() => {
    const distPath = join(process.cwd(), 'dist');
    if (!existsSync(distPath)) {
      throw new Error(
        'dist/ folder not found. Run "npm run build" before executing these tests.'
      );
    }
  });

  pages.forEach(page => {
    describe(`${page}`, () => {
      const folderPath = join(process.cwd(), 'dist', page, 'index.html');
      const rootPath = join(process.cwd(), 'dist', `${page}.html`);
      const htmlPath = existsSync(folderPath) ? folderPath : rootPath;

      beforeAll(() => {
        if (!existsSync(htmlPath)) {
          throw new Error(`Built page not found: ${htmlPath}`);
        }
      });

      const html = readFileSync(htmlPath, 'utf8');

      it('should have description meta tag', () => {
        expect(html).toMatch(/<meta[^\u003e]*name="description"/i);
      });

      it('should have canonical link', () => {
        expect(html).toMatch(/<link[^\u003e]*rel="canonical"/i);
      });

      it('should have og:title meta tag', () => {
        expect(html).toMatch(/<meta[^\u003e]*property="og:title"/i);
      });

      it('should have twitter:card meta tag', () => {
        expect(html).toMatch(/<meta[^\u003e]*name="twitter:card"/i);
      });
    });
  });
});
