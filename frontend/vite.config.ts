import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

export default defineConfig({
    plugins: [
        VueI18nPlugin({
            include: path.resolve(__dirname, './i18n/**'),
            strictMessage: true,
            runtimeOnly: false,
        }),
        vue()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            "@components": path.resolve(__dirname, './components')
        },
        extensions: ['.js', '.ts']
    },
    define: {
        'process.env': process.env
    }
});