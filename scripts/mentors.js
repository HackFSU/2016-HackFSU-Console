/**
* Script to get a list of mentors
*
* WHY ISN'T GULP RUN -S WORKING FOR THIS?
*/

'use strict';

var _ = require('lodash');
var Parse = require('parse/node');

Parse.initialize(
	'7MgItVIkvSmADkIdIVPmEbIOOZQ84ilW224wXsgS',
	'IEVQHLSvq5dWfd1A1d37kk69EHHEOvDkUitPGEDl',
	'nwceDKx3iqtph3SAxaj41LxDavXsujwKWy2yJo3n'
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
