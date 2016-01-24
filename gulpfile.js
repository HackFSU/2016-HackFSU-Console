/**
* Gulp config.
*
* Used to run checks + build js
*
* Do not use this file to boot the server. Instead, build then run.
*/

'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs-extra');

/**
 * Command Line Arguments
 */
var argv = require('yargs')
	.boolean('p')
	.alias('p', 'production')
	.describe('p', 'RUN_LEVEL = PROD')

	.string('s')
	.alias('s', 'script')
	.describe('s', 'Script file to run')

	.argv;


// Project directories
const dirs = {
	lib: __dirname + '/lib',
	app: __dirname + '/app',
	public: {
		build: __dirname + '/public/build',
		static: __dirname + '/public/static',
		es6: __dirname + '/public/es6',
	},
	scripts: {
		src: __dirname + '/scripts/src',
		build: __dirname + '/scripts/build'
	}
};


/**
 * Clean build folders
 * - creates build folder if DNE
 */
gulp.task('clean:app', function(done) {
	try {
		fs.emptyDirSync(dirs.public.build);
		fs.ensureDirSync(dirs.public.build + '/js');

		done();
	} catch(e) {
		done(e);
	}
});
gulp.task('clean:scripts', function(done) {
	fs.emptyDir(dirs.scripts.build, done);
});


/**
 * Run scrips though linter
 */
function jshintStream(src) {
	return gulp.src(src)
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
}
gulp.task('jshint:lib', function() {
	return jshintStream([
		__dirname + '*.js',
		dirs.lib + '/**/*.js'
	]);
});
gulp.task('jshint:app', ['jshint:lib'], function() {
	return jshintStream([
		dirs.app + '/**/*.js',
		dirs.public.static + '/js/**/*.js',
		dirs.public.es6  + '/**/*.js'
	]);
});
gulp.task('jshint:scripts', ['jshint:lib'], function() {
	return jshintStream([
		dirs.scripts + '/**/*.js'
	]);
});


/**
 * Build es6
 * - babel
 * - sourcemaps
 * TODO optional uglify
 */
function buildStream(src, dst) {
	return gulp.src(src)
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dst));
}
gulp.task('build:app', ['clean:app', 'jshint:app'], function() {
	return buildStream([
		dirs.public.es6 + '/**/*.js'
	], dirs.public.build + '/js');
});
gulp.task('build:scripts', ['clean:scripts', 'jshint:scripts'], function() {
	return buildStream([
		dirs.scripts.src + '/**/*.js'
	], dirs.scripts.build);
});


/**
 * Script managment
 * - builds script
 * - runs script
 */

gulp.task('run', ['jshint-scripts'], function(done) {
	var dotenv = require('dotenv');

	dotenv.load();
	if(!process.env.RUN_LEVEL) {
		process.env.RUN_LEVEL = 'DEV';
	}

	require('babel-register');
	require('./scripts/' + argv.script)(done);
});


/**
 * Server managment
 * - builds/rebuilds
 */
gulp.task('watch:app', ['build:app'], function() {
	gulp.watch([
		__dirname + '*.js',
		dirs.public.static + '/js/**/*.js',
		dirs.app + '/js/**/*.js'
	], ['jshint:app']);
	gulp.watch([
		dirs.public.es6 + '/**/*.js'
	], ['build:app']);
});
