var gulp = require('gulp'),
	Browserify = require('gulp.browserify--adapter'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create('demos'),
	watch = require('gulp-watch');

gulp.task('js', function() {
	Browserify.run({
		entry: 'src/js/index.js',
		dest: 'demos',
		outputFile: 'app.js'
	});
})

gulp.task('css', function() {
	return gulp.src('src/scss/app.scss')
		.pipe(sass())
		.pipe(gulp.dest('demos/'))
		.pipe(browserSync.stream());
});

gulp.task('css.watch', function() {
	watch('src/scss/**/*.scss', function() {
		gulp.start('css');
	});
});

gulp.task('server', function() {
	browserSync.init({
		server: 'demos',
		browser: [],
		ghostMode: false,
		files: ['./demos/**/*.(html|js)']
	});
});

gulp.task('default', ['server', 'css', 'css.watch', 'js']);