declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_VERSION: string | undefined;
            VUE_APP_GTAG: string | undefined;
            VITE_GTAG_ID: string | undefined;
        }
    }
}