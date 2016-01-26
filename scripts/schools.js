/**
 * Simple school name/count grab
 */
'use strict';

import Parse from 'parse/node';

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

console.log('Getting school data...');

// make query
let query = new Parse.Query(Parse.Object.extend('Hacker'));
query.limit(10000);
query.select('school');
query.find().then(function(hackers) {
	let schools = {};

	// get counts
	hackers.forEach(function(hacker) {
		let school = hacker.get('school');
		if(!schools[school]) {
			schools[school] = 0;
		}
		++schools[school];
	});

	// custruct sorted array
	let sortedSchools = [];
	for(let name in schools) {
		if(schools.hasOwnProperty(name)) {
			sortedSchools.push({
				name: name,
				count: schools[name]
			});
		}
	}

	sortedSchools.sort(function(a, b) {
		if(a.name < b.name) {
			return -1;
		}
		if(a.name > b.name) {
			return 1;
		}
		return 0;
	});

	// print schools
	console.log(new Date());
	console.log('Hackers', hackers.length);
	console.log('Schools', Object.keys(schools).length);

	sortedSchools.forEach(function(school) {
		console.log(school.count, school.name);
	});

}, function(err) {
	console.log(err);
});
