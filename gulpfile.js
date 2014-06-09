var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({camelize: true});
var argv = require('minimist')(process.argv.slice(2));

gulp.task('bower', function() {
  return plugins.bower().pipe(gulp.dest('build/vendor/'));
});

gulp.task('jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(plugins.jade())
    .pipe(gulp.dest('public/'));
});

gulp.task('less', function() {
  return gulp.src('src/less/all.less')
    .pipe(plugins.less({
      compress: !!argv.production
    }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('typescript', ['bower'], function() {
  return gulp.src('src/ts/**/*.ts')
    .pipe(plugins.tsc({
      module: 'amd',
      noImplicitAny: true,
      target: 'ES5'
    }))
    .pipe(gulp.dest('build/modules/'))
});

gulp.task('zepto', ['bower'], function() {
  return gulp.src([
      'build/vendor/zeptojs/src/zepto.js',
      'build/vendor/zeptojs/src/event.js',
      'build/vendor/zeptojs/src/callbacks.js',
      'build/vendor/zeptojs/src/deferred.js',
      'build/vendor/zeptojs/src/ajax.js'
    ])
    .pipe(plugins.concat('zepto.js'))
    .pipe(gulp.dest('build/modules/'));
});

gulp.task('requirejs', ['typescript', 'zepto'], function() {
  var requirejs = require('requirejs');

  requirejs.optimize({
    name: 'almond',
    baseUrl: 'build/modules/',
    out: 'public/js/all.js',
    optimize: argv.production ? 'uglify' : 'none',
    paths: {
      'almond': '../vendor/almond/almond',
      'bacon': '../vendor/bacon/dist/Bacon',
      'lazy': '../vendor/lazy.js/lazy'
    },
    include: [
      'almond',
      'bacon',
      'feedpon/feedpon'
    ],
    insertRequire: ['feedpon/feedpon'],
    map: {
      '*': {
        'jquery': 'zepto'
      }
    },
    shim: {
      'bacon': {
        deps: ['zepto']
      },
      'zepto': {
        exports: 'Zepto'
      }
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('src/ts/**/*.ts', 'typescript');
});

gulp.task('clean', function() {
  gulp.src(['bower_components', 'build', 'public'])
    .pipe(plugins.clean());
});

gulp.task('default', ['jade', 'less', 'requirejs']);
