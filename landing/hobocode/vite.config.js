import {defineConfig} from 'vite';
export default defineConfig({base:'/hobocode/build/',build:{outDir:'../../hobocode/build',emptyOutDir:true,rollupOptions:{input:'src/main.jsx',output:{entryFileNames:'landing.js',assetFileNames:'[name][extname]',chunkFileNames:'[name]-[hash].js'}}}});
