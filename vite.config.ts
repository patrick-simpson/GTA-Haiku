import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gta-haiku/',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
  optimizeDeps: {
    include: ['three'],
  },
});
