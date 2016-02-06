/**
 * Fixes mentor roles
 * removes acl permission from users without mentor objects
 */

 'use strict';

import Parse from 'parse/node';
import Mentor from 'app/models/Mentor';
import { acl } from 'app/routes/util';
import User from 'app/models/User';
import _ from 'lodash';

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();




function queryMaker(page) {
	let query = new Parse.Query(User);
	query.limit(1000);
	query.skip(1000*page);
	query.select([
		'roleKey'
	]);
	return query;
}


console.log('startin');

function getUsers() {
	return new Promise(function(resolve, reject) {
		queryMaker(0).find().then(function(ul1) {
			queryMaker(1).find().then(function(ul2) {
				resolve(_.union(ul2, ul1));
			}, reject);
		}, reject);
	});
}

function getMentors() {
	return new Promise(function(resolve, reject) {
		let query = new Parse.Query(Mentor);
		query.limit(1000);
		query.include([
			'user'
		]);
		query.select([
			'user',
			'user.objectId'
		]);
		query.find().then(resolve, reject);
	});
}

getUsers()
.then(function(users) {
	console.log('got total', users.length);
	let mentorUsers= [];
	users.forEach(function(u) {
		if(acl.checkKeys(u.get('roleKey'), acl.role('Mentor').id)) {
			mentorUsers.push(u);
		}
	});

	console.log('Got mentorUsers', mentorUsers.length);



	getMentors().then(function(mentors) {
		console.log('Got mentors', mentors.length);
		let badUsers = [];

		// check em all
		mentorUsers.forEach(function(um) {
			if(!checkUserMentor(um)) {
				badUsers.push(um);
			}
		});

		console.log('got bad users', badUsers.length);
		badUsers.forEach(function(bu) {
			let key = bu.get('roleKey');
			key = acl.removeKey(key, acl.role('Mentor').id);
			console.log('bad user mentor',
			acl.checkKeys(bu.get('roleKey'), acl.role('Mentor').id), '=>',
			acl.checkKeys(key, acl.role('Mentor').id));
			bu.set('roleKey', key);
		});
		
		Parse.Object.saveAll(badUsers).then(function(saved) {
			console.log('Fixed', saved.length);
		}, function(err) {
			console.error(err);
		});


		function checkUserMentor(um) {
			let found = false;

			mentors.forEach(function(m) {
				if(m.get('user').objectId === um.id) {
					found = true;
					return false;
				}
			});

			return found;
		}

	})
	.catch(function(err) {
		throw err;
	});
})
.catch(function(err) {
	console.error('Oh noes', err);
});
