import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
// https://github.com/aws-amplify/amplify-js/issues/9639
export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  ...(process.env.NODE_ENV === 'development'
    ? {
        define: {
          global: {},
        },
      }
    : {}),
  server: {
    port: 5176,
  },
  resolve: {
    alias: {
      ...(process.env.NODE_ENV !== 'development'
        ? {
            './runtimeConfig': './runtimeConfig.browser', //fix production build
          }
        : {}),
    },
  },
  build: {
    outDir: `./dist`,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/icons-material',
        '@mui/x-data-grid-premium',
        '@mui/x-data-grid',
        '@mui/x-date-pickers',
        '@mui/x-date-pickers-pro',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@emotion/react': '@emotion/react',
          '@emotion/styled': '@emotion/styled',
          '@mui/material': '@mui/material',
          '@mui/icons-material': '@mui/icons-material',
          '@mui/x-data-grid-premium': '@mui/x-data-grid-premium',
          '@mui/x-data-grid': '@mui/x-data-grid',
          '@mui/x-date-pickers': '@mui/x-date-pickers',
          '@mui/x-date-pickers-pro': '@mui/x-date-pickers-pro',
        },
      },
    },
  },
});
