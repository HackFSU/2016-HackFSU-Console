/**
 * 
 */

'use strict';

import Parse from 'parse/node';


/**
 * Parse Setup
 */


let init = function(name) {
	console.log('Initializing ' + name);
	
	let appId, jsKey, masterKey;

	switch(name) {
		case 'first':
			appId = process.env.PARSE_APP_ID_2014;
			jsKey = process.env.PARSE_JS_KEY_2014;
			masterKey = process.env.PARSE_MASTER_KEY_2014;
			break;
		case 'second':
			appId = process.env.PARSE_APP_ID_2015;
			jsKey = process.env.PARSE_JS_KEY_2015;
			masterKey = process.env.PARSE_MASTER_KEY_2015;
			break;
		case 'current':
			appId = process.env.PARSE_APP_ID;
			jsKey = process.env.PARSE_JS_KEY;
			masterKey = process.env.PARSE_MASTER_KEY;
			break;
	}

	Parse.initialize(appId, jsKey, masterKey);
	Parse.Cloud.useMasterKey();
};




/**
 * Sanatation functions
 */
let sanatizeGithub = function(name) {
	if(!name) {
		return;
	}
	if(name.match(/[\/\.:]/g)) {
		// not just a username, extract it
		let start = name.lastIndexOf('/') + 1;
		if(start !== 0 && start !== name.length) {
			name = name.substring(start);
			if(name.charAt(name.length-1) === '/') {
				name = name.substring(0, name.length-1);
			}
		}
	}

	return name;
};

/**
 * HackerOld class to store in new database
 */
init('current');
let savedCols = [
	'email',
	'firstName',
	'lastName',
	'phoneNumber',
	'school',
	'major', 
	'github',
	'tshirt',
];
class HackerOld extends Parse.Object {
	constructor() {
		super('HackerOld');
	}
}

let hackers = [];

let addHacker = function(hackerData) {
	let hacker;

	if(!hackerData.email) {
		return;
	}

	// Check if exists
	hackers.forEach(function(h) {
		if(h.get('email') === hackerData.email) {
			hacker = h;
			return false;
		}
	});

	if(hacker) {
		// TODO: update rather than create
	} else {
		hacker = new HackerOld();
		hackers.push(hacker);
	}

	for(let key in hackerData) {
		if(savedCols.indexOf(key) !== -1 && typeof hackerData[key] !== 'undefined') {
			hacker.set(key, hackerData[key]);
		}
	}

};

let getFirst = function() {
	return new Promise(function(resolve/*, reject*/) {
		console.log('Ignoring first...');
		resolve();
	});
};

let getSecond = function() {
	return new Promise(function(resolve, reject) {
		console.log('Loading from second...');
		
		let Applications = Parse.Object.extend('Applications');
		let query = new Parse.Query(Applications);

		query.exists('email');
		query.limit(1000);
		query.select([
			'email',
			'firstName',
			'lastName',
			'school',
			'major',
			'github',
			'phoneNumber',
			'tshirt'
		]);

		query.find().then(function(results) {
			results.forEach(function(app) {
				addHacker({
					email: app.get('email'),
					firstName: app.get('firstName'),
					lastName: app.get('lastName'),
					school: app.get('school'),
					major: app.get('major'),
					github: sanatizeGithub(app.get('github')),
					phoneNumber: app.get('phoneNumber'),
					tshirt: app.get('tshirt')
				});
			});
			resolve();
		}, function(err) {
			reject(err);
		});
	});
};


export default function main(done) {
	console.log('Starting...');

	init('first');
	getFirst().then(function() {
		init('second');
		getSecond().then(function() {
			console.log('Got ' + hackers.length + ' hackers.');

			if(hackers.length) {
				init('current');
				console.log('Saving to current...');

				// TODO: account for duplicates already in current db

				Parse.Object.registerSubclass('HackerOld', HackerOld);
				Parse.Object.saveAll(hackers).then(function() {
					console.log('Success!');
					done();

				}, function(err) {
					console.log('Save error! ', err);
					done();
				});
			} else {
				console.log('Nothing to save, exiting.');
				done();
			}
			
		}, function(err) {
			console.log('Error loading second ', err);
			done();
		});
	}, function(err) {
		console.log('Error loading first ', err);
		done();
	});
}








