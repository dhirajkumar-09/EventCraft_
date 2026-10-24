import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    testTimeout: 15000,
    include: ['tests/**/*.{test,spec}.{js,jsx}', 'src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/vite-env.d.ts',
        'src/config/**'
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 75,
        statements: 90
      }
    }
  }
});
