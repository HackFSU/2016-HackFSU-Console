/**
* Registration controller duh
*/

'use strict';

export default function(app) {
	app.controller.Registration = {

		index: (req, res) => {
			res.render('registration/index', {
				title: 'Register'
			});
		},

		submit: (req, res) => {
			console.log(req.body);

			// Registrations create a Hacker object that also points to a User for
			// "global" data
			let hacker = new app.model.Hacker(req.body);
			hacker.signUp().then(
				(hacker) => {
					console.log(`Hacker created!`);
				},
				(error) => {
					console.log(`Fucked up creating a hacker: ${app.util.inspect(error)}`);
				}
			);

			res.send({
				success: true
			});
		}
	};
}
