var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var gzip = require('gulp-gzip');

gulp.task('production', ['sassgz', 'jsgz', 'vendorgz']);

gulp.task('watch', ['sass', 'js', 'templates'], function() {
    gulp.watch('./css/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./components/templates/*.handlebars', ['templates']);
});

gulp.task('sass', function () {
    gulp.src('./css/*.scss')
          .pipe(concat('all.scss'))
          .pipe(sass().on('error', sass.logError))
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest('./dist/css'));
});

gulp.task('sassgz', function () {
  gulp.src([
          './src/scss/*.scss'
      ])
        .pipe(concat('all.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gzip())
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('jsgz', function () {
  gulp.src([
          'js/*.js'
      ])
      .pipe(concat('all.js'))
      .pipe(uglify({ mangle: false }))
      .pipe(gzip())
      .pipe(gulp.dest('./dist/js'))
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
            'components/templates/card.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
    gulp.src([
            'components/templates/info.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
    gulp.src([
            'components/templates/coverage.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
    gulp.src([
            'components/templates/related-coverage.handlebars'
        ])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/templates'))
});

gulp.task('vendor', function () {
    gulp.src([
            'js/vendor/*.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('./dist/vendor'))
});

gulp.task('vendorgz', function () {
  gulp.src([
          'js/vendor/*.js'
      ])
      .pipe(concat('vendor.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gzip())
      .pipe(gulp.dest('./dist/vendor'))
});
