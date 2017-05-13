var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

gulp.task('watch', ['sass', 'js', 'templates'], function() {
    gulp.watch('./css/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./templates/*.handlebars', ['templates']);
});

gulp.task('sass', function () {
    gulp.src('./css/*.scss')
          .pipe(concat('all.scss'))
          .pipe(sass().on('error', sass.logError))
        //   .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function () {
    gulp.src([
            'js/*.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('templates', function () {
    gulp.src([
            'templates/card.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
    gulp.src([
            'templates/info.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
    gulp.src([
            'templates/coverage.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
});

gulp.task('vendor', function () {
    gulp.src([
            'js/vendor/*.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/vendor'))
});
