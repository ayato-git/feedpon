var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({camelize: true});
var argv = require('minimist')(process.argv.slice(2));
var isProduction = argv.production;
var isWatching = false;

gulp.task('bower', function(done) {
  var bower = require('bower');
  bower.commands.install().on('end', function() {
    done();
  });
});

gulp.task('copy', ['copy:fonts']);

gulp.task('copy:fonts', ['bower'], function() {
  return gulp.src([
      'bower_components/ionic/fonts/*',
    ])
    .pipe(gulp.dest('build/www/fonts'));
});

gulp.task('jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(isWatching ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.jade({pretty: !isProduction}))
    .pipe(gulp.dest('build/www/'));
});

gulp.task('sass', ['bower'], function() {
  return gulp.src('src/scss/index.scss')
    .pipe(isWatching ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.sass())
    .pipe(isProduction ? plugins.minifyCss() : plugins.util.noop())
    .pipe(gulp.dest('build/www/css/'));
});

gulp.task('typescript', ['bower'], function() {
  return gulp.src('src/ts/**/*.ts')
    .pipe(isWatching ? plugins.plumber() : plugins.util.noop())
    .pipe(plugins.tsc({
      module: 'commonjs',
      noImplicitAny: true,
      target: 'ES5'
    }))
    .pipe(gulp.dest('build/modules/'));
});

gulp.task('browserify', ['typescript'], function() {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  return browserify({
      basedir: './build/modules/',
      entries: ['./feedpon/bootstrap.js']
    })
    .bundle()
    .pipe(source('index.js'))
    .pipe(isProduction ? plugins.streamify(plugins.uglify({
        compress: {
          angular: true
        }
      })) : plugins.util.noop())
    .pipe(gulp.dest('build/www/js/'));
});

gulp.task('connect', function() {
  plugins.connect.server({
    root: 'build/www/'
  });
});

gulp.task('watch', function() {
  isWatching = true;

  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch(['src/ts/**/*.ts', 'src/templates/**/*'], ['browserify']);
});

gulp.task('symlink', ['copy', 'jade', 'sass', 'browserify'], function() {
  gulp.src('build/www')
    .pipe(plugins.symlink('app/chrome'))
    .pipe(plugins.symlink('app/cordova'));
});

gulp.task('clean', function() {
  return gulp.src(['build', 'app/chrome/www', 'app/cordova/www'])
    .pipe(plugins.clean());
});

gulp.task('default', ['symlink']);
