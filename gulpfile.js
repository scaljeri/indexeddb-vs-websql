var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var $ = require('gulp-load-plugins')();
var connect = require('gulp-connect');

gulp.task('default', function () {
    gulp.start('js', 'css', 'watch');
});

gulp.task('watch', ['webserver'], function () {
    $.livereload.listen();

    gulp.watch('app/scss/**/*.scss', ['css']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('app/js/**/*.js', ['js']);

    gulp.src('index.html')
        .pipe($.watch('index.html'))
        .pipe($.livereload());
});

gulp.task('webserver', function () {
    connect.server({
        host: 'localhost',
        port: 9000,
        livereload: true
    });
});

gulp.task('js', function () {
    browserify('./app/js/app.js', {
            debug: true
        })
        .transform(to5ify)
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./build'))
        .pipe($.livereload());
});

gulp.task('css', function () {
    'use strict';
    var cssFilter = $.filter(['*.css']);
    var processors = [
            require('postcss-assets')({
            loadPath: './app/img'
        }),
            require('autoprefixer-core')({
            browsers: ['last 2 versions', 'IE 10']
        }),
            require('css-mqpacker')
            // require('csswring')
        ];

    return gulp.src('app/scss/styles.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true,
            includePaths: ['bower_components']
        }))
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write('.'))
        .pipe(cssFilter)
        .pipe(cssFilter.restore())
        .pipe($.size({
            showFiles: true
        }))
        .pipe(gulp.dest('build/css'))
        .pipe($.livereload());
});
