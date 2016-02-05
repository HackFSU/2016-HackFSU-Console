/**
 * Loads wifi creds from wifikeys/keys.txt and saves them in Parse as WifiCreds
 * DO NOT CALL THIS TWICE - it will make duplicates
 */
'use strict';

import Parse from 'parse/node';
import WifiCred from 'app/models/WifiCred';
import path from 'path';
import fs from 'fs-extra';

const IN_FILE = path.resolve(__dirname + '/../wifikeys/keys.txt');

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();


let creds = [];

/**
 * Read in keys from file and create WifiCred objects
 */
fs.readFile(IN_FILE, 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	let lines = data.split('\n');
	lines.forEach(function(line) {
		let tabIndex = line.indexOf('\t');
		let cred = WifiCred.new({
			username: line.substring(0, tabIndex),
			password: line.substring(tabIndex+1)
		});
		creds.push(cred);
	});

	// Save all to parse
	Parse.Object.saveAll(creds).then(function(list) {
		console.log('Saved', list.length, 'wifi keys');
	}, function(err) {
		console.error('Unable to save to parse');
		throw err;
	});
});
