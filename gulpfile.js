// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var nano = require('gulp-cssnano');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var image = require('gulp-image');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var babel = require('gulp-babel');
var newer  = require('gulp-newer');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var bourbon = require('node-bourbon').includePaths;
var neat = require('node-neat').includePaths;




// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile and Minify Our Sass
gulp.task('sass', function() {
     var onError = function(error) {
        notify.onError({
                    title:    "GULP",
                    subtitle: "Erreur(s) détectée(s) ! Gulp n'a pas su effectuer la tâche demandée",
                    message:  "Error: <%= error.message %>",
                    icon: false,
                    sound: false
                })(error);

        this.emit('end');
    };

    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({
            style: 'expanded',
            includePaths: bourbon,
          includePaths: neat
      
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(nano())
        .pipe(gulp.dest('dist/css'));
});


// Copy react.js and react-dom.js to assets/js/src/vendor
// only if the copy in node_modules is "newer"
gulp.task('copy-react', function() {
  return gulp.src('node_modules/react/dist/react.js')
    .pipe(newer('./src/js/vendor/react.js'))
    .pipe(gulp.dest('./src/js/vendor/'));
});

gulp.task('copy-react-dom', function() {
  return gulp.src('node_modules/react-dom/dist/react-dom.js')
    .pipe(newer('./src/js/vendor/react-dom.js'))
    .pipe(gulp.dest('./src/js/vendor/'));
});


gulp.task('browserify', function() {
  return browserify({
      extensions: ['.jsx', '.js'],
      debug: true,
      cache: {},
      packageCache: {},
      fullPaths: true,
      entries: './src/js/main.js',
    })
    .transform(babelify.configure({ 
        presets: ['es2015', 'stage-2', 'react'],
        ignore: /(bower_components)|(node_modules)/
    }))
    .bundle()
    .pipe(source('all.js'))
    .pipe(gulp.dest('./dist/js'))
    .on("error", function (err) { console.log("Error : " + err.message); })
    
});


gulp.task('image', function () {
  gulp.src('src/imgs/**/**')
    .pipe(image())
    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('browsersync', function(){

browserSync.init({
        proxy: "local.projet"
    });

});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('dist/**/*.php', [reload]);
    gulp.watch('src/js/*.{js,jsx}', [ 'lint', 'browserify', reload]);
    gulp.watch('src/scss/*.scss', ['sass', reload]);
    gulp.watch('src/imgs/**/**', ['image', reload]);

});






// Default Task
gulp.task('default', [ 'browserify','lint', 'sass', 'image', 'browsersync', 'watch']);
// Default react
gulp.task('react', [ 'copy-react','copy-react-dom', 'browserify','lint', 'sass', 'image', 'browsersync', 'watch']);