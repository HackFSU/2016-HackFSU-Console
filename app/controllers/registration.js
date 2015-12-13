/**
* Registration controller duh
*/

'use strict';

import emailer from '../../lib/mandrill-templates.js';


export default function(app) {

	const store = app.store;
	const Parse = app.Parse;


	let sendConfirmationEmail = function(hackerEmail, firstName) {
		let dfd = new Parse.Promise();

		let email = {
			template: 'hackfsu-confirmation',
			content: [{}],
			message: {
		    "subject": "See you this Spring!",
		    "from_email": "registration@hackfsu.com",
		    "from_name": "HackFSU",
		    "to": [{
		            "email": hackerEmail,
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
			// Validate request
			// req.checkBody('email', 'Invalid email').notEmpty().isEmail();
			// req.checkBody('firstName', 'Invalid first name').notEmpty().isAlpha();
			// req.checkBody('lastName', 'Invalid last name').notEmpty().isAlpha();
			// req.checkBody('password', 'Invalid password').notEmpty().isString();
			// req.checkBody('school', 'Invalid school').notEmpty().isString();
			// req.checkBody('year', 'Invalid year').notEmpty().isString();
			// //req.checkBody('shirtSize').isShirtSize();
			// req.checkBody('shirtSize').notEmpty().isString();
			// req.checkBody('major', 'Invalid major').notEmpty().isString();
			// req.checkBody('firstHackathon', 'Invalid first hackathon selection').notEmpty().isString();
			// req.checkBody('github').isString(); // NOT a url
			// req.checkBody('resume').isBase64();
			// req.checkBody('phone').isString();
			// req.checkBody('hate').isString();
			// req.checkBody('diet', 'Invalid diet').notEmpty().isString();
			// req.checkBody('comments').notEmpty().isString();
			// req.checkBody('hackerGoals').isHackerGoalArray();
			// req.checkBody('jobGoals').isJobGoalArray();
			// req.checkBody('gender').isString();
			// req.checkBody('ethnicity').isString();
			// req.checkBody('yesno18').isString();
			// req.checkBody('mlhcoc').isString();


			//req.checkBody('anonStats').isAnonStatArray();
			//
			// if(req.validationErrors()) {
			// 	req.sendError(400, 'Invalid request data', {
			// 		validationErrors: req.validationErrors()
			// 	});
			// 	return;
			// }

			req.body.firstHackathon = 'yes' ? true : false;
			req.body.yesno18 = 'yes' ? true : false;
			req.body.mlhcoc = 'yes' ? true : false;

			let hacker = new app.model.Hacker(req.body);

			// // Create AnonStats
			// let anonStats = [];
			// anonStats.forEach(function(pair) {
			// 	anonStats.push(new app.model.AnonStat(pair));
			// });

			hacker.signUp().then(function(hacker) {
				// Parse.Object.saveAll(anonStats).then(function(results) {
				// 	if(!results || results.length !== anonStats.length) {
				// 		res.sendError(500, 'Not all AnonStat objects saved', results);
				// 		return;
				// 	}

					// Complete, send confirmation email
					res.json({
						name: hacker.name()
					});

					sendConfirmationEmail(hacker.get('email'),
						hacker.get('firstName')
					);

				// }, function(err) {
				// 	res.sendError(500, 'Unable to save AnonStat(s)', err);
			//	});
			}, function(err) {
				res.sendError(500, 'Unable to save Hacker', err);
			});
		},


	};
}
