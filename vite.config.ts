/// <reference types="vitest" />
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const stylesPath = resolve(dirname(fileURLToPath(import.meta.url)), 'src/styles');

const scssOptions = {
  api: 'modern-compiler',
  loadPaths: [stylesPath],
};

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    globals: true,
    testTimeout: 15000,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@styles': stylesPath,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        ...scssOptions,
      },
    },
  },
});
