//подключит пакеты
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var pug = require('gulp-pug');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('clean:build', function() {
    // content
    return del('/build');
});

//подключить задачи
// Static server
gulp.task('server',  function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
    gulp.watch('src/pug/**/*.*', ['pug']);
    gulp.watch('src/less/**/*.less', ['less']);

    gulp.watch('src/js/**/*.js', ['copy:js']);
    gulp.watch('src/libs/**/*.*', ['copy:libs']);
    gulp.watch('src/img/**/*.*', ['copy:img']);
 });

    gulp.task('copy:js', function() {
        // content
        return gulp.src('src/js/**/*.*')
          .pipe(gulp.dest('./build/js'))
          .pipe(browserSync.stream());
    });
     gulp.task('copy:libs', function() {
        // content
        return gulp.src('src/libs/**/*.*')
          .pipe(gulp.dest('./build/libs'))
          .pipe(browserSync.stream());
    });
      gulp.task('copy:img', function() {
        // content
        return gulp.src('src/img/**/*.*')
          .pipe(gulp.dest('./build/img'))
          .pipe(browserSync.stream());
    });
    
    gulp.task('less', function() {
     // content
     return gulp.src('./src/less/main.less')
     //обработка ошибок
     .pipe(plumber({
        errorHandler: notify.onError(function(err){
          return {
            title: 'Styles',
            message: err.message
          }
        })
     }))
     // end обработка ошибок
       .pipe(sourcemaps.init()) 
       .pipe(less())
       .pipe( autoprefixer({
         browsers: ['last 3 versions'],
          cascade: false
       }))

       .pipe(sourcemaps.write()) 
       .pipe(gulp.dest('./build/css'))
       .pipe(browserSync.stream());
});

   gulp.task('pug', function(){
    return gulp.src('./src/pug/pages/**/*.pug')
      //обработка ошибок
     .pipe(plumber({
        errorHandler: notify.onError(function(err){
          return {
            title: 'Pug',
            message: err.message
          }
        })
     }))
     // end обработка ошибок
     .pipe(pug({
        pretty: true
     }))
     .pipe(gulp.dest('./build/'))
     .pipe(browserSync.stream());
   });  

gulp.task('default', function(callback){
     runSequence(
      'clean:build',
      ['less', 'pug', 'copy:js', 'copy:libs', 'copy:img'],
      'server',
      callback
      )
});

