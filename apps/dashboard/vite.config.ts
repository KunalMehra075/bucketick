import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': r('./src'),
      // Resolve workspace packages to their TS source so Vite compiles them
      // (avoids the "don't transform node_modules" issue for raw .ts/.tsx).
      // design-tokens is intentionally NOT aliased — it's consumed only as CSS
      // subpaths (resolved via package exports), and a prefix alias would break
      // those subpath imports.
      '@bucketick/ui': r('../../packages/ui/src/index.ts'),
      '@bucketick/api-client': r('../../packages/api-client/src/index.ts'),
    },
  },
  server: { host: '::', port: 3000 },
});
