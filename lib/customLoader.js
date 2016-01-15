/**
 * Custom loader for loading all files in directory. Loads alphabetically, 
 * depth-first if dir. Files restricted to .js
 *
 * Throws a runtime error if dir string does not exist or is not a directory
 */
'use strict';

import fs from 'fs';
import path from 'path';
import _ from 'lodash';


/**
 * Recusively loads exports into exps array
 */
let fetchExports = function(pathname, exps) {
	let stats = fs.lstatSync(pathname);

	if(stats.isDirectory()) {
		fs.readdirSync(pathname).forEach(function(file) {
			fetchExports(path.join(pathname, file), exps);
		});
	} else if(path.extname(pathname) === '.js') {
		exps.push(require(pathname));
	}
};


/**
 * Returns an object of all of the exports within the given directory or single
 * file.
 */
export function mergeAllExports(dir) {
	let exps, result;		// all folder exports

	if(!_.isString(dir)) {
		throw 'Invalid params';
	}

	exps = [];
	fetchExports(path.resolve(dir), exps);

	// Join all exports into single object
	result = {};
	exps.foreach(function(e) {
		_.merge(result, e);
	});

	return result;
}

/**
 * Loads all nested files' export function, passing in obj.
 *
 * Only loads into file if it exports a function.
 */
export function loadAllExports(obj, dir) {
	let exps;

	if(!_.isString(dir)) {
		throw 'Invalid params';
	}

	exps = [];
	fetchExports(path.resolve(dir), exps);

	exps.forEach(function(e) {
		if(_.isFunction(e)) {
			e(obj);
		}
	});
}

