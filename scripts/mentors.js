/**
* Script to get a list of mentors
*/

'use strict';

var _ = require('lodash');
var Parse = require('parse/node');

Parse.initialize(
	'',
	'',
	''
);
Parse.Cloud.useMasterKey();

let query = new Parse.Query(Parse.Object.extend('Mentor'));
query.limit(300);
query.include('user');
query.find().then(function(mentors) {
	console.log(mentors.length);

	_.each(mentors, function(mentor) {
		let theuser = mentor.get('user');
		console.log(`${theuser.get('firstName')} ${theuser.get('lastName')} - ${theuser.get('email')}`);
	});
});
