import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: { host: '::', port: 3001 },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      // Multi-page build: each entry becomes a real HTML file for crawlers.
      input: {
        main: resolve(root, 'index.html'),
        privacy: resolve(root, 'privacy.html'),
        terms: resolve(root, 'terms.html'),
        about: resolve(root, 'about.html'),
        contact: resolve(root, 'contact.html'),
      },
      output: {
        // Keep the animation libs in their own chunk so the initial paint is light.
        manualChunks: {
          gsap: ['gsap'],
          motion: ['lenis', 'split-type'],
        },
      },
    },
  },
});
