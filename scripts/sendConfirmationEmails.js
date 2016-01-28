/*
* Script to email hackers a link to confirm their spot
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import emailer from '../lib/emailer';

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

let Hacker = Parse.Object.extend('Test');
let query = new Parse.Query(Hacker);
query.limit(1000);
query.find().then(function(hackers) {
	_.each(hackers, function(hacker) {
		let to = [{
			email: hacker.get('email'),
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
