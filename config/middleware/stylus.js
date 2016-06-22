var path = require('path');
var stylus = require('stylus');
var autoprefixer = require('autoprefixer-stylus');

module.exports = function() {
  return stylus.middleware({
    src: path.join(__dirname, '../../assets'),
    dest: path.join(__dirname, '../../public'),
    compile(str, filepath) {
      return stylus(str)
        .use(autoprefixer())
        .set('filename', filepath)
        .set('sourcemap', { inline: true });
    }
  });
};
