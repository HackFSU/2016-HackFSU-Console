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
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs-extra');
var header = require('gulp-header');
require('app-module-path/register');	// allows app/* require() access

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

var pkg = require('./package.json');

// Project directories
var dirs = {
	lib: __dirname + '/lib',
	app: __dirname + '/app',
	public: {
		__dirname: __dirname + '/public',
		build: __dirname + '/public/build',
		static: __dirname + '/public/static',
		es6: __dirname + '/public/es6',
	},
	scripts: __dirname + '/scripts'
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

gulp.task('jshint', ['jshint:lib', 'jshint:app', 'jshint:scripts']);


/**
 * Build es6
 * - babel
 * - sourcemaps
 * TODO optional uglify
 */

gulp.task('build', ['clean:app'], function() {
	var babel = require('gulp-babel');
	return gulp.src([
		dirs.public.es6 + '/**/*.js'
	])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(header(fs.readFileSync(dirs.public.__dirname + '/header.js'), { pkg: pkg }))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dirs.public.build + '/js'));
});

/**
 * Script managment
 * - builds script
 * - runs script
 */
gulp.task('run', function(done) {
	var dotenv = require('dotenv');

	dotenv.load();
	if(!process.env.NODE_ENV) {
		process.env.NODE_ENV = 'development';
	}

	if(!argv.script) {
		new Error('No script given. Run with "gulp run -s <script name>"');
	}

	console.log('Loading script "' + argv.script + '"');

	require('babel-register');
	jshintStream([
		dirs.scripts + '/' + argv.script
	]);
	require(dirs.scripts + '/' + argv.script);

});


/**
 * Server managment
 * - builds/rebuilds
 */
gulp.task('watch', ['build'], function() {
	gulp.watch([
		__dirname + '*.js',
		dirs.public.static + '/js/**/*.js',
		dirs.app + '/js/**/*.js'
	], ['jshint:app']);
	gulp.watch([
		dirs.public.es6 + '/**/*.js'
	], ['build']);
});
