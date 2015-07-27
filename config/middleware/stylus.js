var path = require('path');
var stylus = require('stylus');
var autoprefixer  = require('autoprefixer-stylus');

module.exports = function() {

  return stylus.middleware({
    src:     path.join(__dirname, '../../assets'),
    dest:    path.join(__dirname, '../../public'),
    compile: function (str, path, fn) {
      return stylus(str)
        .use(autoprefixer())
        .set('filename', path)
        .set('compress', true);
    }
  });

};