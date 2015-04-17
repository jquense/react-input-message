'use strict';
var gulp = require('gulp')
  , less = require('gulp-less')
  , toFive = require("gulp-babel")
  , rimraf  = require('rimraf')
  , rename  = require('gulp-rename')
  , plumber = require('gulp-plumber')
  , configs = require('./webpack.configs')

  , WebpackDevServer = require("webpack-dev-server")
  , webpack = require('webpack');

gulp.task('watch-less',  function(){
  return gulp.src('./src/styles.less')
      .pipe(plumber())
      .pipe(less({ compress: false }))
      .pipe(gulp.dest('./dev/css'));
})

gulp.task('less', ['clean'], function(){
  return gulp.src('./src/less/*.less')
      .pipe(plumber())
      .pipe(less({ compress: true }))
      .pipe(gulp.dest('./lib/styles'));
})

gulp.task('clean', function(cb){
  rimraf('./lib', cb);
})

gulp.task('build', ['clean'], function(){
  gulp.src('./src/less/*.less')
    .pipe(gulp.dest('./lib/styles'))

  return gulp.src(['./src/**/*.jsx', './src/**/*.js'])
      .pipe(plumber())
      .pipe(toFive(configs.to5Config))
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('./lib'));
})

gulp.task('dev', function() {

  gulp.watch('./src/*.less',  ['watch-less']);
  
  new WebpackDevServer(webpack(configs.dev), {
    publicPath: "/dev",
    stats: { colors: true }
  }).listen(8080, "localhost");
})

gulp.task("webpack", function(callback) {
    // run webpack
    webpack(configs.test, function(err, stats) {
      callback(err);
    });
});

gulp.task('release', ['clean', 'build', 'less'])

gulp.task('publish', ['release'], require('rf-release'))