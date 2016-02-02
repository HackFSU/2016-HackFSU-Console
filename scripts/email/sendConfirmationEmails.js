/*
* Script to email hackers a link to confirm their spot
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

let Hacker = Parse.Object.extend('Hacker');
let query = new Parse.Query(Hacker);
query.include('user');
query.limit(1000);
// I got this date value by looking at the first confirmation (confirmed almost
// immediately after emails were sent), so this is the oldest regsitration after
// confirmation emails were sent.
// FOR REFERENCE: Most recent date = 2016-02-02T05:12:15.694Z
query.greaterThan('createdAt', new Date("2016-02-02T02:10:24.628Z"));
query.find().then(function(hackers) {
	let i = 0;
	_.each(hackers, function(hacker) {
		console.log(i);
		i++;
		let to = [{
			email: hacker.get('user').get('email'),
			type: 'to'
		}];
		let email = {
			template: 'hackfsu-confirm',
			content: [{}],
			message: {
				"subject": "Confirm your spot!",
				"from_email": "confirm@hackfsu.com",
				"from_name": "HackFSU",
				"to": to,
				"merge": true,
				"merge_language": "mailchimp",
				"global_merge_vars": [{
					"name": "ID",
					"content": hacker.id
				}]
			}
		};

		console.log(hacker.id);

		emailer(email, function(err, res) {
			if (err) {
				throw new Error(err);
			}
			else {
				console.log(res);
			}
		});
	});
});
