import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '::', port: 3001 },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
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
