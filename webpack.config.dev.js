const path = require('path');

const prodConfig = require('./webpack.config')
const devConfig = Object.assign(prodConfig)

devConfig.devtool = '#inline-source-map';
devConfig.mode = 'development'
devConfig.devServer = {
  port: 8889,
  contentBase: path.join(__dirname, 'public'),
  proxy: {
    '*': 'http://localhost:8080'
  }
}

module.exports = devConfig
