var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch');

var child = require('child_process');
var gutil = require('gulp-util');


gulp.task('styles:style', function() {
  return gulp.src('assets/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'explorer >= 10'
      ]
    }))
    .pipe(cleanCSS({restructuring: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css/'));
});

//js

gulp.task('scripts:dependencies', function() {
  return gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/p5.js/lib/p5.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('libraries.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/libraries/'));
});

gulp.task('scripts:global', function() {
  return gulp.src('assets/scripts/global/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('global.js'))
    .pipe(uglify({
      output: {
        max_line_len: 500
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/scripts/'));
});

gulp.task('scripts:main', function() {
  return gulp.src('assets/scripts/main/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify({
      output: {
        max_line_len: 500
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/scripts/'));
});

gulp.task('jekyll:build', function(){
  const jekyll = child.spawn('jekyll', ['build',
    '--incremental',
    '--drafts'
  ]);
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('jekyll:watch', function(){
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

//watches
gulp.task('styles:watch', function() {
  watch('_sass/**/*.scss', function() {
    gulp.start('styles:style');
    // gulp.start('jekyll:build');
  });
});

gulp.task('scripts:watch', function() {
  watch('assets/scripts/main/**/*.js', function() {
    gulp.start('scripts:main');
    // gulp.start('jekyll:build');
  });
  watch('assets/scripts/global/**/*.js', function() {
    gulp.start('scripts:global');
    // gulp.start('jekyll:build');
  });
});


//cui
gulp.task('styles', ['styles:style']);
gulp.task('scripts', ['scripts:dependencies', 'scripts:global', 'scripts:main']);

gulp.task('watch', ['styles:watch', 'scripts:watch' ,'jekyll:watch']);
gulp.task('default', ['scripts', 'styles', 'jekyll:build']);
