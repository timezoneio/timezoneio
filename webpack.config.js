const webpack = require('webpack');
const glob = require('glob');

const entries = glob.sync('./app/apps/*.js').reduce(function(obj, path) {
  var filename = path.match(/.+\/(\w+).js/)[1];
  obj[filename] = path;
  return obj;
}, {});

module.exports = {
  entry: entries,
  mode: 'production',
  output: {
		path: __dirname + '/public',
		publicPath: '/',
		filename: 'js/bundles/[name].js'
	},
  resolve: {
    extensions: ['.json', '.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      }
    ]
  },
  plugins: [
    // Build the production version of React
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
       }
    }),
    // Only include British english in addition to American English for moment.js
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb)$/)
  ]
};
