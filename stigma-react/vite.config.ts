import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  build:
    mode === 'lib'
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'StigmaForm',
            formats: ['es', 'umd'],
            fileName: (format) => `stigma-form.${format}.js`,
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: { react: 'React', 'react-dom': 'ReactDOM' },
            },
          },
        }
      : undefined,
}));
