/**
* Registration controller duh
*/

'use strict';

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
		}

	};
}
