/**
* Script to send emails to people who registered last year but have yet to
* register this year.
*
*/

'use strict';

import emailer from 'common/lib/emailer';
import _ from 'lodash';
import Parse from 'parse/node';
import Hacker from 'common/models/hacker';

Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

// Arrays to hold data from old/current/ registrations
// Formatted as
// {
//		firstName: '',
//		lastName: '',
//		email: '',
// }
let old = [];
let current = [];
let diff = [];		// This will hold the difference between old and current,
									// aka the people we should email.

// No model for HackerOld
let HackerOld = Parse.Object.extend('HackerOld');

let queryOld = new Parse.Query(HackerOld);
let queryCurrent = new Parse.Query(Hacker);

// Query options
queryOld.limit(1000);
queryCurrent.limit(1000);
queryCurrent.include('user');


// Find the old registrations
queryOld.find()
.then(function(results) {
	console.log(`Old Registrations: (${results.length})\n`);
	_.each(results, function(result) {
		console.log(result.get('email'));

		old.push(result.get('email').trim());
	});

	// Find the current registrations
	return queryCurrent.find();
})
// Promises are fun
.then(function(results) {
	let promise = new Parse.Promise.as();

	console.log(`\nCurrent Registrations: (${results.length})\n`);

	_.each(results, function(result) {
		console.log(result.get('user').get('email'));

		current.push(result.get('user').get('email').trim());
	});
	return promise;
})
.then(function() {
	diff = _.difference(old, current);

	console.log(`\nUnregistered Prior Registrants (${diff.length})\n`);
	_.each(diff, function(person) {
		console.log(person);
	});

	console.log(
`
Old: ${old.length}
Current: ${current.length}
Unregistered: ${diff.length}
`
	);

	// Send emails to unregistered
	let to = [];
	_.each(diff, function(o) {
		to.push({
			email: o,
			type: 'to'
		});
	});

	let test = [
		{
			email: 'thelms501@gmail.com',
			type: 'to'
		}
	];

	let email = {
		template: 'hackfsu-lastyear',
		content: [{}],
		message: {
			"subject": "HackFSU is Back!",
			"from_email": "registration@hackfsu.com",
			"from_name": "HackFSU",
			"to": to,
			"merge": true,
			"merge_language": "mailchimp",
			"global_merge_vars": [{}]
		}
	};

	emailer(email, (error, response) => {
		if (error) {
			throw Error;
		}

		console.log(response);
	});
});





//
// FUNCTIONS ARE FUN
//

// Return full name
function fullName(person) {
	try {
		if (person.get('user')) {
			person = person.get('user');
		}

		return `${person.get('firstName')} ${person.get('lastName')}`;
	}
	catch (err) {
		// Probably isn't a Parse instance
		return `${person.firstName} ${person.lastName}`;
	}
}

// Return an object with first name, last name, and email
function emailCreds(person) {
	return {
		email: person.get('email'),
		firstName: person.get('firstName'),
		lastName: person.get('lastName')
	};
}
