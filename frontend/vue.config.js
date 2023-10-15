// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            // .loader('vue-loader')
            .tap(options => {
                options.complierOptions = {whitespace: 'preserve'};
                // options.prettify = false;
                return options;
            });
    },
    devServer: {
        host: 'localhost',
        port: 4000,
        allowedHosts: [
            'frontend',
            'localhost',
            'reader.dev.andyi95.com',
            'reader.stage.andyi95.com',
            'text-tools.ru'
        ],
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws'
        }
    },
    pluginOptions: {
        sitemap:{
            urls: [
                'https://text-tools.ru',
                'https://text-tools.ru/spreeder',
                'https://text-tools.ru/anticipation',
                'https://text-tools.ru/text'
            ]
        }
    },
    // configureWebpack: {
    //     plugins: [new BundleAnalyzerPlugin()]
    // }
}
