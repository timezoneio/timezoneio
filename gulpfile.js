var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var awspublish = require('gulp-awspublish');

var awsCredentials = require('./aws.json');


var entries = glob.sync('./app/apps/*.js').reduce(function(obj, path) {
  var filename = path.match(/.+\/(\w+).js/)[1];
  obj[filename] = path;
  return obj;
}, {});

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

var webpackConfig = {
  entry: entries,
  output: {
		path: __dirname + '/public',
		publicPath: '/',
		filename: 'js/bundles/[name].js'
	},
  resolve: {
    extensions: ['', '.json', '.jsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?stage=0'],
      },
      { include: /\.json$/, loaders: ["json-loader"] } // moment-timezone
    ]
  },
  plugins: [
    // Build the production version of React
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
       }
    }),
  ]
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
  var compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'public'),
    stats: webpackStats,
    // hot: true,
    // This is where we're running our app server
    proxy: {
      '*': 'http://localhost:8080'
    }
  }).listen(8888, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server error', err);
    // Server listening
    gutil.log('[webpack-dev-server]',
      'http://localhost:8080/webpack-dev-server/index.html');

    // Comment out to keep the server running
    // callback();
  });
});

/*
gulp.task('browserify', function() {

  var browserified = transform(function(filename) {
    return browserify(filename)
      .transform(babelify)
      .bundle();
  });

  return gulp.src(['app/apps/*.js'])
    .pipe(plumber())
    .pipe(browserified)
    .pipe(gulp.dest('public/js/bundles'));

});
*/


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
  var publisher = awspublish.create(awsCredentials);
  return gulp.src(['public/images/**/*'])
    .pipe(rename(function (path) {
      path.dirname = 'images/' + path.dirname;
    }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('upload-css', function() {
  var publisher = awspublish.create(awsCredentials);
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
  var publisher = awspublish.create(awsCredentials);
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


gulp.task('uglify', function() {
  return gulp.src(['public/js/bundles/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('public/js/bundles'));
});

gulp.task('watch', ['webpack'], function() {
  return gulp.watch([
    'app/**/*.js',
    'app/**/*.jsx'
  ], ['browserify']);
});

gulp.task('predeploy', ['webpack', 'upload-images', 'upload-css', 'upload-js']);

gulp.task('default', ['browserify']);
