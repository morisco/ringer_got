var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

gulp.task('watch', ['sass', 'js', 'vendor'], function() {
    gulp.watch('./css/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['js']);
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


gulp.task('vendor', function () {
    gulp.src([
            'js/vendor/*.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/vendor'))
});
