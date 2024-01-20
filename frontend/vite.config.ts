import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Sitemap from 'vite-plugin-sitemap';
import {TailwindCSSVitePlugin} from "tailwindcss-vite-plugin";
import {ViteWebfontDownload} from "vite-plugin-webfont-dl";

export default defineConfig(({command, mode}) => {
    const parent = path.resolve(process.cwd(), '..');
      const env = loadEnv(mode, parent, 'VITE_')
        return {
            plugins: [
                VueI18nPlugin({
                    include: path.resolve(__dirname, './i18n/**'),
                    strictMessage: true,
                    runtimeOnly: false,
                }),
                vue(),
                Sitemap({
                    changefreq: 'weekly',
                    // hostname: 'https://reader.dev.andyi95.com',
                    hostname: 'https://text-tools.ru',
                    dynamicRoutes: [
                        '/', '/text', '/anticipation', '/spreeder', '/mixer', '/schulte', '/voice'
                    ]
                }),
                TailwindCSSVitePlugin(),
                ViteWebfontDownload ([
                    'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap'
                ],)

            ],
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    "@components": path.resolve(__dirname, './components')
                },
                extensions: ['.js', '.ts']
            },
            define: {
                'process.env': env
            }
        }
    }
);
