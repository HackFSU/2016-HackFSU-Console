/*
* Script to email confirmed hackers extra info
*
* Latest sent email: 2016-02-04T17:37:43.609Z
* ^ Use greaterThan
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import emailer from '../../lib/emailer';

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

let Confirmation = Parse.Object.extend('Confirmation');
let query = new Parse.Query(Confirmation);
query.include('hacker');
query.limit(1000);
query.greaterThan('createdAt', new Date('2016-02-03T16:06:49.342Z'));
query.find().then(function(confirms) {
	let i = 0;
	_.each(confirms, function(confirm) {
		let hackerQuery = new Parse.Query(Parse.Object.extend('Hacker'));
		hackerQuery.include('user');

		hackerQuery.get(confirm.get('hacker').id)
		.then(function(hacker) {
			console.log(i + ' ' + hacker.get('user').get('email'));
			i++;
			let to = [{
				email: hacker.get('user').get('email'),
				type: 'to'
			}];
			let email = {
				template: 'hackfsu-infoweekof',
				content: [{}],
				message: {
					"subject": "A Few HackFSU Updates!",
					"from_email": "updates@hackfsu.com",
					"from_name": "HackFSU",
					"to": to,
					"merge": true,
					"merge_language": "mailchimp",
					"global_merge_vars": [{
						"name": "FIRSTNAME",
						"content": hacker.get('user').get('firstName')
					}]
				}
			};

			console.log(hacker.get('user').get('firstName'));

			emailer(email, function(err, res) {
				if (err) {
					throw new Error(err);
				}
				else {
					console.log(res);
				}
			});
		});

		return;

	});
});
