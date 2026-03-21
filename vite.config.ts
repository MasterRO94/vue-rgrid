import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueRGrid',
      formats: ['es', 'umd'],
      fileName: 'vue-rgrid',
    },
    rollupOptions: {
      external: ['vue', 'axios'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          axios: 'axios',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
