var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var awspublish = require('gulp-awspublish');

var awsCredentials = require('./aws.json');


gulp.task('browserify', function() {

  var browserified = transform(function(filename) {
    return browserify(filename)
      .transform(reactify)
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

// TODO - Needs stylus compile + versioning
gulp.task('upload-css', function() {
  var publisher = awspublish.create(awsCredentials);
  return gulp.src(['public/stylesheets/**/*'])
    .pipe(rename(function (path) {
      path.dirname = 'stylesheets/' + path.dirname;
    }))
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// TODO - Needs versioning
gulp.task('upload-js', function() {
  var publisher = awspublish.create(awsCredentials);
  return gulp.src(['public/js/bundles/*.js'])
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.dirname = 'js/bundles/' + path.dirname;
    }))
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish(s3Headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});


gulp.task('uglify', function() {
  return gulp.src(['public/js/bundles/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('public/js/bundles'));
});

gulp.task('watch', function() {
  return gulp.watch([
    'app/**/*.js',
    'app/**/*.jsx'
  ], ['browserify']);
});

gulp.task('predeploy', ['upload-images'/*, 'upload-css'*/]);

gulp.task('default', ['browserify']);
