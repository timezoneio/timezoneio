var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var awspublish = require('gulp-awspublish');

const webpackConfig = require('./webpack.config')

var webpackStats = {
  assets: true,
  colors: true,
  version: true,
  modules: false,
  hash: false,
  timings: false,
  chunks: true,
  chunkModules: false,
  reasons : true,
  cached : true,
  chunkOrigins : true
};

var getAWSConfig = function() {
  return require('./aws.json');
};

gulp.task('webpack', function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString(webpackStats));
    callback();
  });
});

gulp.task('webpack-dev-server', function(callback) {

  var devConfig = webpackConfig;
  devConfig.devtool = '#inline-source-map';
  devConfig.mode = 'development'
  var compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'public'),
    stats: webpackStats,
    // hot: true,
    // This is where we're running our app server
    proxy: {
      '*': 'http://localhost:8080'
    }
  }).listen(8888, function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server error', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8888');
  });
});

var getExpires = function() {
  var expires = new Date();
  expires.setFullYear(expires.getFullYear()+10);
  return expires;
};

var s3Headers = {
  'Cache-Control': 'max-age=315360000, no-transform, public',
  'Expires': getExpires()
};

gulp.task('upload-images', function() {
  var publisher = awspublish.create(getAWSConfig());
  return gulp.src(['public/images/**/*'])
    .pipe(rename(function (path) {
      path.dirname = 'images/' + path.dirname;
    }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('upload-css', function() {
  var publisher = awspublish.create(getAWSConfig());
  return gulp.src(['assets/stylesheets/index.styl'])
    .pipe(stylus())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.dirname = 'stylesheets/' + path.dirname;
    }))
    .pipe(rev())
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest('./'));
});

gulp.task('upload-js', ['webpack'], function() {
  var publisher = awspublish.create(getAWSConfig());
  return gulp.src(['public/js/bundles/*.js'])
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.dirname = 'js/bundles/' + path.dirname;
    }))
    .pipe(rev())
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest('./'));
});

gulp.task('predeploy', ['webpack', 'upload-images', 'upload-css', 'upload-js']);

gulp.task('default', ['webpack']);
