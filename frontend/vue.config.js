module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.complierOptions = {whitespace: 'preserve'};
                return options;
            });
    },
  devServer: {
    disableHostCheck: true,
    host: 'localhost',
    port: 4000,
    allowedHosts: [
        'frontend',
        'localhost',
        'reader.dev.andyi95.com'
    ]
  }
}
