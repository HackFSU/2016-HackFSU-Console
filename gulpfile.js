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

var argv = require('yargs')

	.boolean('p')
	.alias('p', 'production')
	.describe('p', 'RUN_LEVEL = PROD')

	.string('s')
	.alias('s', 'script')
	.describe('s', 'Script file to run')

	.argv;

var dirs = {
	es6: __dirname + '/public/es6',
	views:  __dirname + '/public/js/views',
	js: __dirname + '/public/js',
	app: __dirname + '/app',
	lib: __dirname + '/lib',
	boot: __dirname + '/boot',
	scripts: {
		src: __dirname + '/scripts/src',
		build: __dirname + '/scripts/build'
	}
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

	// try {
	// 	fs.statSync(dirs.scripts.dest);
	// } catch (e) {
	// 	fs.mkdirSync(dirs.scripts.dest);
	// } finally {
	// 	del([dirs.scripts.dest + '/*.js']).then(function() {
	// 		done();
	// 	});
	// }
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

gulp.task('jshint-scripts', function() {
	return gulp.src([dirs.scripts.src + '/**/*.js'])
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

gulp.task('transpile-scripts', ['jshint-scripts'], function() {
	return gulp.src([dirs.scripts.src + '/*.js'])
		.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
		.pipe(sourcemaps.write('./', {
			sourceRoot: '../src',
		}))
		.pipe(gulp.dest(dirs.scripts.build));
});

gulp.task('default', ['jshint-backend', 'transpile-frontend'], function() {

	gulp.watch([dirs.es6 + '/**/*.js'], ['transpile-frontend']);


	if(argv.production) {
		process.env.RUN_LEVEL = 'PROD';
	}

	// Initiate boot
	require('./server');

});


gulp.task('run', ['jshint-scripts'], function(done) {
	var dotenv = require('dotenv');

	dotenv.load();
	if(!process.env.RUN_LEVEL) {
		process.env.RUN_LEVEL = 'DEV';
	}

	require('babel/register');
	require('./scripts/' + argv.script)(done);
});
