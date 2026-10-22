import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    lib: {
      entry: {
        'normalize-options': 'tests/normalize-options.test.ts',
        'use-async-options': 'tests/use-async-options.test.ts',
      },
      formats: ['es'],
    },
    outDir: '/tmp/test-dist',
    emptyOutDir: true,
    rollupOptions: { external: ['react', 'react-dom'] },
    minify: false,
  },
});
