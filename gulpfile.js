var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');

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

gulp.task('predeploy', function() {
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

gulp.task('default', ['browserify']);
