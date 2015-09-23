var gulp = require('gulp');
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

gulp.task('upload-js', ['browserify'], function() {
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

gulp.task('watch', ['browserify'], function() {
  return gulp.watch([
    'app/**/*.js',
    'app/**/*.jsx'
  ], ['browserify']);
});

gulp.task('predeploy', ['browserify', 'upload-images', 'upload-css', 'upload-js']);

gulp.task('default', ['browserify']);
