var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var gzip = require('gulp-gzip');


gulp.task('production', gulp.series(gulp.parallel(sassgz, jsgz, vendorgz, templatesCard, templatesCoverage, templatesInfo, templatesRelated)));

gulp.task('watch', gulp.series(gulp.parallel(sss, js, vendor, watchTask, templatesCard, templatesCoverage, templatesInfo, templatesRelated)));

function watchTask(){
    gulp.watch('./css/*.scss', sss);
    gulp.watch('./js/*.js',js);
    gulp.watch('./js/vendor/*.js', vendor);
}

function sassgz() {
  return (
    gulp.src([
      './css/_1vars.scss',
      './css/_mixins.scss',
      './css/*.scss',
    ])
    .pipe(concat('all.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/css'))
);
}


function sss() {
    return (
        gulp.src([
          './css/_1vars.scss',
          './css/_mixins.scss',
          './src/scss/*.scss',
        ])
        .pipe(concat('all.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
    );
}

function jsgz() {
    return (
        gulp.src([
            './js/*.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(gzip())
        .pipe(gulp.dest('./dist/js'))
    );
}

function js() {
    return(
        gulp.src([
            './js/*.js'
        ])
        .pipe(concat('all.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
    )
}

function vendor() {
    return(
        gulp.src([
            './js/vendor/*.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('./dist/vendor'))
    )
}

function templatesCard() {
    return(
      gulp.src([
        'components/templates/card.handlebars'
      ])
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./dist/templates'))
    )
}

function templatesInfo() {
  return(
    gulp.src([
      'components/templates/info.handlebars'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/templates'))
  )
}

function templatesCoverage() {
  return(
    gulp.src([
      'components/templates/coverage.handlebars'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/templates'))
  );
}

function templatesRelated() {
  return (
    gulp.src([
      'components/templates/related-coverage.handlebars'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/templates'))
  );
}

function vendorgz() {
    return(
    gulp.src([
        './js/vendor/*.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/vendor'))
    );
}