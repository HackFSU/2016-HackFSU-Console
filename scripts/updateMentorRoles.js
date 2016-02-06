/**
 * Fixes mentor roles
 */

 'use strict';

import Parse from 'parse/node';
import Mentor from 'app/models/Mentor';
import { acl } from 'app/routes/util';
import User from 'app/models/User';

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();


let mentorQuery = new Parse.Query(Mentor);
mentorQuery.include([
	'user'
]);
mentorQuery.select([
	'user',
	'user.roleKey'
]);


console.log('startin');
mentorQuery.find().then(function(mentors) {
	let users = [];
	console.log('got ' + mentors.length);

	mentors.forEach(function(m) {
		let userData = m.get('user');

		let currKey = userData.roleKey;
		if(!currKey) {
			currKey = acl.role('User').id;
		}
		currKey = acl.addKeys(currKey, acl.role('Mentor').id);
		console.log(currKey);

		let user = new User();
		user.id = userData.objectId;
		user.set('objectId', user.id);
		user.set('roleKey', currKey);

		users.push(user);
	});

	console.log('savin', users.length);

	Parse.Object.saveAll(users).then(function(all) {
		console.log('Updated ' + all.length );
	}, function(err) {
		console.error('No!', err);
	});

}, function(err) {
	console.error('No!', err);
});
