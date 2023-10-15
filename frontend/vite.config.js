import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import {defineConfig} from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import path from 'path'
export default defineConfig({
    plugins: [
        VueI18nPlugin({
            include: path.resolve(__dirname, './i18n/**')
        }),
        vue()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL('./src', import.meta.url)),
            "@components": path.resolve(__dirname, './components')
        },
        extensions: ['.js', '.ts', ]
    },
    define: {
        'process.env': process.env
    }
})
