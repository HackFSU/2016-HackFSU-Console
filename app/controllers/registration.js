/**
* Registration controller duh
*/

'use strict';

import emailer from '../../lib/mandrill-templates.js';

export default function(app) {
	app.controller.Registration = {

		// Index page
		index: (req, res) => {
			res.render('registration/index', {
				title: 'Register'
			});
		},

		// Create a hacker
		createHacker: (req, res, next) => {
			console.log(req.body);

			// Registrations create a Hacker object that also points to a User for
			// "global" data
			let hacker = new app.model.Hacker(req.body);
			hacker.signUp().then(
				(hacker) => {
					console.log(`Hacker with ID #${hacker.id} created!`);
					next();
				},
				(error) => {
					console.log(`Fucked up creating a hacker: ${app.util.inspect(error)}`);
					res.send({
						error: error
					});
				}
			);
		},

		// Send confirmation email
		sendConfirmationEmail: (req, res, next) => {
			console.log(req.body.firstName);

			let email = {
				template: 'test-1',
				content: [{}],
				message: {
			    "subject": "example subject",
			    "from_email": "registration@hackfsu.com",
			    "from_name": "HackFSU",
			    "to": [{
			            "email": req.body.email,
			            "name": `${req.body.firstname} ${req.body.lastName}`,
			            "type": "to"
			    }],
			    "merge": true,
			    "merge_language": "mailchimp",
			    "global_merge_vars": [{
			      "name": "firstname",
			    	"content": req.body.firstName
			    }]
				}
			};

			emailer(email, (error, response) => {
				if (error) {
					console.log(error);
					res.send({ error: true });
				}

				console.log(response);
				res.send({ success: true });

			});
		}

	};
}
