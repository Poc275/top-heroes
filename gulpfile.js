var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var all_tasks = ['lint', 'icons', 'images', 'css', 'home', 'html', 'js', 'vendor'];

var path = {
    // HTML templates
    HOME: [
        'src/*.html'
    ],
    HTML: [
        'src/templates/*.html'
    ],
    // My JS Source Code
    JS: [
        'src/javascripts/*.js',
        'src/javascripts/**/*.js'
    ],
    ICO: [
        'src/icons/**'
    ],
    IMAGES: [
        'src/images/**'
    ],
    CSS: [
        'src/stylesheets/*.css',
        'node_modules/angular-material/angular-material.min.css'
    ],
    // vendor js/css, Angular etc.
    VENDOR: [
        'node_modules/crypto-js/crypto-js.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-aria/angular-aria.min.js',
        'node_modules/angular-material/angular-material.min.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js',
        'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
        'node_modules/socket.io-client/dist/socket.io.slim.js'
    ],
    PUBLIC: [
        './public'
    ]
};

// Clean up PUBLICribution directory
gulp.task('clean', function() {
    return gulp.src('./public/*', { force: true })
        .pipe(clean());
});

// JSHint for code quality
gulp.task('lint', function() {
    return gulp.src(path.JS)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// Copy over icons, images, css and html
gulp.task('icons', function() {
    gulp.src(path.ICO)  
        .pipe(gulp.dest(path.PUBLIC + '/icons'));
});

gulp.task('images', function() {
    gulp.src(path.IMAGES)  
        .pipe(gulp.dest(path.PUBLIC + '/images'));
});

gulp.task('css', function() {
    gulp.src(path.CSS)  
        .pipe(gulp.dest(path.PUBLIC + '/stylesheets'));
});

gulp.task('home', function() {
    gulp.src(path.HOME)
        .pipe(gulp.dest(path.PUBLIC + '/'));
});

gulp.task('html', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.PUBLIC + '/templates'));
});

// Merge, uglify and copy JS files
gulp.task('js', function() {
    gulp.src(path.JS)
        .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.PUBLIC + '/js'));
});

gulp.task('vendor', function() {
    gulp.src(path.VENDOR)
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        // only uglify if gulp is ran with '--type production'
        // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(uglify())
        .pipe(gulp.dest(path.PUBLIC + '/js'));
});

gulp.task('watch', function() {
    // i.e. when anything in path.CSS changes, run the css task
    gulp.watch(path.ICO, ['icons']);
    gulp.watch(path.IMAGES, ['images']);
    gulp.watch(path.CSS, ['css']);
    gulp.watch(path.HOME, ['home']);
    gulp.watch(path.HTML, ['html']);
    gulp.watch(path.JS, ['js']);
    gulp.watch(path.VENDOR, ['vendor']);
});

gulp.task('default', all_tasks);