import { App } from 'vue';

interface ClarityPluginOptions {
    clarityId: string;
}

export default {
    install: (app: App, options?: ClarityPluginOptions) => {
        if (!options || !options.clarityId) {
            console.warn("Clarity ID is missing");
            return;
        }

        (function(c: Window & typeof globalThis, l: Document, a: string, r: string, i: string, t: HTMLScriptElement, y: HTMLScriptElement) {
            c[a]=c[a]||function() { (c[a].q=c[a].q||[]).push(arguments); };
            t=l.createElement(r); t.async=1; t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0]; y.parentNode!.insertBefore(t,y);
        })(window, document, "clarity", "script", options.clarityId);
    }
}
