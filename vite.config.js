import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    eslint({
      overrideConfigFile: './eslint.config.js',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src/'), // Correct path for alias
    },
  },
});
