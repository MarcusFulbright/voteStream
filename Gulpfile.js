'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', () => {
 return gulp.src('./app/styles/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./app/styles/css'));
});

gulp.task('default', () => {
  gulp.watch('./app/styles/scss/**/*.scss', ['sass']);
});
