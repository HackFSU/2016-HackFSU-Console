/**
 * 
 */

'use strict';

import Parse1 from 'parse/node';
import Parse2 from 'parse/node';
import Parse3 from 'parse/node';


/**
 * Parse Setup
 */

const Parse = {
	first: Parse1,
	second: Parse2,
	current: Parse3
};

let init = function() {
	console.log('Initializing...');
	
	Parse.first.initialize(
		process.env.PARSE_APP_ID_2014,
		process.env.PARSE_JS_KEY_2014,
		process.env.PARSE_MASTER_KEY_2014
	);
	Parse.second.initialize(
		process.env.PARSE_APP_ID_2015,
		process.env.PARSE_JS_KEY_2015,
		process.env.PARSE_MASTER_KEY_2015
	);
	Parse.current.initialize(
		process.env.PARSE_APP_ID,
		process.env.PARSE_JS_KEY,
		process.env.PARSE_MASTER_KEY
	);

	Parse.first.Cloud.useMasterKey();
	Parse.second.Cloud.useMasterKey();
	Parse.current.Cloud.useMasterKey();
};




/**
 * Sanatation functions
 */
let sanatizeGithub = function(name) {
	if(!name) {
		return;
	}

	// TODO, take away urls

	return name;
};

let sanatizeSchool = function(name) {
	if(!name) {
		return;
	}

	// TODO, make sure is in the data .json list

	return name;
};


/**
 * HackerOld class to store in new database
 */
class HackerOld extends Parse.current.Object {
	constructor(o) {
		super('HackerOld');

		this.email = o.email;
		this.firstName = o.firstName;
		this.lastName = o.lastName;
		this.phoneNumber = o.phoneNumber;
		this.school = sanatizeSchool(o.school);
		this.major = o.major;
		this.github = sanatizeGithub(o.github);
		this.tshirt = o.tshirt;
	}
}
Parse.current.Object.registerSubclass('HackerOld', HackerOld);


let hackers = [];

let addHacker = function(hackerData) {
	let exists = false;

	if(!hackerData.email) {
		return;
	}

	// Check if exists
	hackers.forEach(function(hacker) {
		if(hacker.get('email') === hackerData.email) {
			exists = true;
			return false;
		}
	});

	if(exists) {
		// TODO: update rather than create
	} else {
		hackers.push(new HackerOld(hackerData));
	}

};


let getFirst = function() {
	return new Promise(function(resolve/*, reject*/) {
		console.log('Loading from first...');
		resolve();
	});
};

let getSecond = function() {
	return new Promise(function(resolve/*, reject*/) {
		console.log('Loading from second...');
		resolve();
	});
};


export default function main(done) {
	init();

	console.log('Starting...');
	getFirst().then(function() {
		getSecond().then(function() {
			console.log('Got ' + hackers.length + ' hackers.');

			if(hackers.length) {
				console.log('Saving to current...');
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








