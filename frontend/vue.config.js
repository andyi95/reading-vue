module.exports = {

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
