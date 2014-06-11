var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({camelize: true});
var argv = require('minimist')(process.argv.slice(2));

var isWatched = argv._.indexOf('watch') >= 0;
var isProduction = argv.production;

gulp.task('bower', function() {
  return plugins.bower().pipe(gulp.dest('src/vendor/'));
});

gulp.task('jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(isWatched ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.jade({pretty: !isProduction}))
    .pipe(gulp.dest('app/cordova/www'));
});

gulp.task('less', function() {
  return gulp.src('src/less/index.less')
    .pipe(isWatched ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.less({
      compress: isProduction
    }))
    .pipe(gulp.dest('app/cordova/www/css/'));
});

gulp.task('typescript', ['bower'], function() {
  return gulp.src('src/ts/**/*.ts')
    .pipe(isWatched ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.tsc({
      module: 'amd',
      noImplicitAny: true
    }))
    .pipe(gulp.dest('build/modules/'))
});

gulp.task('js:zepto', ['bower'], function() {
  return gulp.src([
      'src/vendor/zeptojs/src/zepto.js',
      'src/vendor/zeptojs/src/event.js',
      'src/vendor/zeptojs/src/callbacks.js',
      'src/vendor/zeptojs/src/deferred.js',
      'src/vendor/zeptojs/src/ajax.js'
    ])
    .pipe(isWatched ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.concat('zepto.js'))
    .pipe(gulp.dest('build/modules/'));
});

gulp.task('requirejs', ['typescript', 'js:zepto'], function() {
  var requirejs = require('requirejs');

  requirejs.optimize({
    name: 'almond',
    baseUrl: 'build/modules/',
    out: 'app/cordova/www/js/index.js',
    optimize: isProduction ? 'uglify' : 'none',
    paths: {
      'almond': '../../src/vendor/almond/almond',
      'bacon': '../../src/vendor/bacon/dist/Bacon',
      'framework7': '../../src/vendor/framework7/dist/js/framework7',
      'jquery': 'zepto',
      'lazy': '../../src/vendor/lazy.js/lazy'
    },
    include: [
      'almond',
      'bacon',
      'feedpon/feedpon',
      'framework7'
    ],
    insertRequire: ['feedpon/feedpon'],
    shim: {
      'bacon': {
        deps: ['jquery']
      },
      'framework7': {
        deps: ['jquery'],
        exports: 'Framework7'
      },
      'jquery': {
        exports: '$'
      }
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch('src/ts/**/*.ts', ['requirejs']);
});

gulp.task('clean', function() {
  gulp.src(['bower_components', 'build', 'src/vendor', 'app/www'])
    .pipe(plugins.clean());
});

gulp.task('default', ['jade', 'less', 'requirejs']);
