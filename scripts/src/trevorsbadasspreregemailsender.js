'use strict';

import emailer from '../../lib/mandrill-templates';
import _ from 'lodash';
import Parse from 'parse/node';

Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();


let to = [];

let Subscriber = Parse.Object.extend('Subscriber');
let query = new Parse.Query(Subscriber);
query.find({
	success: (results) => {
		_.each(results, (subscriber) => {
			to.push({
				email: subscriber.get('email'),
				type: 'to'
			});
		});

		_.each(to, (o) => {
			console.log(o);
		});

		let email = {
			template: 'hackfsu-pre-registration',
			content: [{}],
			message: {
				"subject": "Registration is live!",
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

	},
	error: (error) => {
		console.log(error);
		throw Error;
	}
});
