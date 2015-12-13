/**
* Registration controller duh
*/

'use strict';

import emailer from '../../lib/mandrill-templates.js';


export default function(app) {

	const store = app.store;
	const Parse = app.Parse;


	let sendConfirmationEmail = function(hackerEmail, firstName, lastName) {
		let dfd = new Parse.Promise();

		let email = {
			template: 'test-1',
			content: [{}],
			message: {
		    "subject": "example subject",
		    "from_email": "registration@hackfsu.com",
		    "from_name": "HackFSU",
		    "to": [{
		            "email": hackerEmail,
		            "name": `${firstName} ${lastName}`,
		            "type": "to"
		    }],
		    "merge": true,
		    "merge_language": "mailchimp",
		    "global_merge_vars": [{
		      "name": "firstname",
		    	"content": firstName
		    }]
			}
		};

		emailer(email, (error) => {
			if(error) {
				console.error(`[EMAIL ERROR] Unable to send confirmation to "${hackerEmail}"`);
				dfd.reject(error);
				return;
			}

			console.log(`Confirmation email sent to "${hackerEmail}"`);
			dfd.resolve();
		});

		return dfd;
	};



	app.controller.Registration = {

		// Index page
		index: function(req, res) {
			res.render('registration/index', {
				title: 'Register'
			});
		},

		// Submission
		submit: function(req, res) {
			let reqErrors;

			// Validate request
			req.checkBody('firstName', 'Invalid first name').notEmpty().isAlpha();
			req.checkBody('lastName', 'Invalid last name').notEmpty().isAlpha();
			req.checkBody('email', 'Invalid email').notEmpty().isEmail();
			req.checkBody('password', 'Invalid password').notEmpty().isString();
			req.checkBody('diet', 'Invalid diet').notEmpty().isString();
			req.checkBody('shirtSize').isShirtSize();
			req.checkBody('github').notEmpty().isString(); // NOT a url
			req.checkBody('phone').notEmpty().isString();
			req.checkBody('resume').isBase64();
			req.checkBody('codeOfConduct').isBoolean();
			req.checkBody('yesno18').isBoolean();
			req.checkBody('jobGoals').isJobGoalArray();
			req.checkBody('hackerGoals').isHackerGoalArray();
			req.checkBody('comments').notEmpty().isString();

			req.checkBody('anonStats').isAnonStatArray();

			reqErrors = req.validationErrors();
			if(reqErrors) {
				req.sendError(400, 'Invalid request data', {
					validationErrors: reqErrors
				});
				return;
			}

			// Create Hacker
			let hacker = new app.model.Hacker({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				diet: req.body.diet,
				shirtSize: req.body.shirtSize,
				github: req.body.github,
				phone: req.body.phone,
				codeOfConduct: req.body.codeOfConduct,
				yesno18: req.body.yesno18,
				jobGoals: store.util.getIdArray(req.body.jobGoals, store.util.getJobGoalId),
				hackerGoals: store.util.getIdArray(req.body.jobGoals, store.util.getJobGoalId),
				comments: req.body.comments
			});

			// Create AnonStats
			let anonStats = [];
			anonStats.forEach(function(pair) {
				anonStats.push(new app.model.AnonStat(pair));
			});

			// Save & send confirmation
			hacker.saveResume(req.body.resume).then(function() {
				hacker.save().then(function() {
					Parse.Object.saveAll(anonStats).then(function(results) {
						if(!results || results.length !== anonStats.length) {
							res.sendError(500, 'Not all AnonStat objects saved', results);
							return;
						}

						// Complete, send confirmation email
						res.json({});

						sendConfirmationEmail(hacker.get('email'), 
							hacker.get('firstName'),
							hacker.get('lastName')
						);

					}, function(err) {
						res.sendError(500, 'Unable to save AnonStat(s)', err);
					});
				}, function(err) {
					res.sendError(500, 'Unable to save Hacker', err);
				});
			}, function(err) {
				res.sendError(500, 'Unable to save Resume', err);
			});
		},
		

	};
}
