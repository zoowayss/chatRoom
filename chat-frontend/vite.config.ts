import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    define: {
        global: 'window'
    },
    plugins: [vue()],
    server: {
        port: 5174,
        host: '0.0.0.0',
        proxy: {
            '/ws': {
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true
            }
        },
        historyApiFallback: true
    }
}) 