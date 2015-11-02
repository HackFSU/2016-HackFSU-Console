/**
 * Gulp config. 
 * 
 * Used to run checks + transpile front end and then boot the server.
 */

'use strict';

var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
// var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');

var dirs = {
	es6: __dirname + '/public/es6',
	views:  __dirname + '/public/js/views',
	js: __dirname + '/public/js',
	app: __dirname + '/app',
	lib: __dirname + '/lib',
	boot: __dirname + '/boot'
};

gulp.task('clean', function(done) {
	try {
		fs.statSync(dirs.views);
	} catch (e) {
		fs.mkdirSync(dirs.views);
	} finally {
		del([dirs.views + '/**']).then(function() {
			done();
		});
	}
});

gulp.task('jshint-backend', function() {
	return gulp.src([
			'gulpfile.js',
			'server.js',
			dirs.lib + '/**/*.js',
			dirs.boot + '/**/*.js',
			dirs.app + '/**/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('jshint-frontend', function() {
	return gulp.src([dirs.es6 + '/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('transpile-frontend', ['clean', 'jshint-frontend'], function() {
	return gulp.src(['public/es6' + '/**/*.js'])
		.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
			// .pipe(uglify())
		.pipe(sourcemaps.write('./', {
			sourceRoot: '/es6',
		}))
		.pipe(gulp.dest(dirs.views));
});

gulp.task('default', ['jshint-backend', 'transpile-frontend'], function() {

	gulp.watch([dirs.es6 + '/**/*.js'], ['transpile-frontend']);

	// Initiate boot
	require('./server');
	
});
