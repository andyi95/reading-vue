module.exports = {

  devServer: {
    disableHostCheck: true,
    host: 'localhost',
    https: true,
    port: 4000,
    allowedHosts: [
        'frontend',
        'localhost',
        'reader.dev.andyi95.com'
    ]
    // public: 'https://login-dev.mindfit.keenetic.pro/'
  }
}
