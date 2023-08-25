import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import eslintPlugin from 'vite-plugin-eslint';
import ElementPlus from 'unplugin-element-plus';
import ElectronDevPlugin from './plugins/vite-plugins.electron.dev';
import ElectronBuildPlugin from './plugins/vite-plugins.electron.build';
import { buildConfig } from './plugins/build.electron';

const ElementPlusVite = ElementPlus.vite;

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
    ElementPlusVite({}),
    eslintPlugin(),
    ElectronDevPlugin(),
    ElectronBuildPlugin(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: buildConfig.mainDir,
  },
  server: {
    host: true,
    port: 20000,
  },
});
