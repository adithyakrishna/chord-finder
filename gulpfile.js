var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');

//script paths
var jsFiles = ['js/vendor/jquery.js', 'js/vendor/semantic.js', 'js/vendor/lodash.js', 'js/vendor/linedtextarea.js', 'js/vendor/raphael.js', 'js/vendor/jTab.js', 'js/vendor/jschord.js', 'js/build.js'],
	jsDest = 'dist/js';

var cssFiles = ['css/normalize.css', 'css/vendor/semantic.css', 'css/vendor/linedtextarea.css', 'css/main.css'],
	cssDest = 'dist/css';

// js
gulp.task('scripts', function() {
	return gulp.src(jsFiles)
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(jsDest))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(jsDest));
});

// css
gulp.task('css', function(){
    gulp.src(cssFiles)
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe(concat('style.min.css'))        
        .pipe(gulp.dest(cssDest))
});