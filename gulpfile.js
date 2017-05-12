var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
    gulp.src('./css/*.scss')
          .pipe(concat('all.scss'))
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('./dist/css'));
});
