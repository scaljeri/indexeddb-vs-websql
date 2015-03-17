var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  browserify('./src/app.js', { debug: true })
      .transform(to5ify)
      .bundle()
      //.on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      //.pipe(uglify())
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./build'));
});

/*
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require('gulp-6to5');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
 
gulp.task('default', function () {
    return gulp.src('src/** /*.js')
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(concat('app-all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
        .pipe(gulp.dest('build'));
});*/