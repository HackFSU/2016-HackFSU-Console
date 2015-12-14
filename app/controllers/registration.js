/**
* Registration controller duh
*/

'use strict';

import emailer from '../../lib/mandrill-templates.js';


export default function(app) {

	const store = app.store;
	const Parse = app.Parse;
	const _ = app._;
	const validator = app.validator;

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
			let hackerAttrs = _.pick(req.body,
				'email',
				'firstName',
				'lastName',
				'password',
				'school',
				'year',
				'shirtSize',
				'major',
				'firstHackathon',
				'github',
				'resumeBase64',
				'phone',
				'hate',
				'diet',
				'comments',
				'wants',
				'wantjob',
				'yesno18',
				'mlhcoc'
			);

			let anonStats = [
				{
					name: 'gender',
					option: req.body.gender
				},
				{
					name: 'ethnicity',
					option: req.body.ethnicity
				}
			];

			// Change some of the defaults
			hackerAttrs.email = hackerAttrs.email.toLowerCase();
			hackerAttrs.firstHackathon = hackerAttrs.firstHackathon === 'yes' ? true : false;
			hackerAttrs.yesno18 = hackerAttrs.yesno18 === 'yes' ? true : false;
			hackerAttrs.mlhcoc = hackerAttrs.mlhcoc === 'yes' ? true : false;
			hackerAttrs.wantjob = _.isArray(hackerAttrs.wantjob) || _.isEmpty(hackerAttrs.wantjob) ? hackerAttrs.wantjob : [ hackerAttrs.wantjob ];
			hackerAttrs.wants = _.isArray(hackerAttrs.wants) || _.isEmpty(hackerAttrs.wants) ? hackerAttrs.wants : [ hackerAttrs.wants ];

			// Validate data
			let o = hackerAttrs;
			let valErrs = [];
			valErrs.push(validator.isAscii(o.firstName));
			valErrs.push(validator.isAscii(o.lastName));
			valErrs.push(validator.isEmail(o.email));
			valErrs.push(validator.isAscii(o.password));
			valErrs.push(validator.isAscii(o.school));
			valErrs.push(validator.isAlpha(o.year));
			valErrs.push(validator.isAscii(o.shirtSize));
			valErrs.push(validator.isAscii(o.major));
			valErrs.push(validator.isBoolean(o.firstHackathon));
			valErrs.push(validator.isAlphanumeric(o.github) || _.isEmpty(o.github));
			valErrs.push(validator.isBase64(o.resumeBase64) || _.isEmpty(o.resumeBase64));
			valErrs.push(validator.isAscii(o.phone) || _.isEmpty(o.phone));
			valErrs.push(validator.isAscii(o.hate) || _.isEmpty(o.hate));
			valErrs.push(validator.isAscii(o.diet) || _.isEmpty(o.diet));
			valErrs.push(validator.isAscii(o.comments) || _.isEmpty(o.comments));
			valErrs.push(_.isArray(o.wants) || _.isEmpty(o.wants));
			valErrs.push(_.isArray(o.wantjob) || _.isEmpty(o.wantjob));
			valErrs.push(validator.isBoolean(o.yesno18));
			valErrs.push(validator.isBoolean(o.mlhcoc));
			// Convert this to a loop
			valErrs.push(validator.isAscii(anonStats[0].option) || _.isEmpty(anonStats[0].option));
			valErrs.push(validator.isAscii(anonStats[1].option) || _.isEmpty(anonStats[1].option));

			// Send error if there were validation errors
			if(_.includes(valErrs, false)) {
				console.log(app.util.inspect(valErrs));

				res.json({
					error: 'There were one or more validation errors in the form.'
				});
				return;
			}

			let hacker = new app.model.Hacker(hackerAttrs);

			hacker.signUp().then(function(hacker) {
				let user = hacker.get('user');
					// Complete, send confirmation email
					res.json({
						name: user.name()
					});

					_.each(anonStats, (stat) => {
						if (stat.option !== undefined) {
							let anonStat = new app.model.AnonStat(stat);
							anonStat.save().then((stat) => {
								console.log('Anon Stat saved: ', stat);
							},
							(err) => {
								console.log('Anon Stat not saved: ', err);
							});
						}
					});

					sendConfirmationEmail(user.get('email'),
						user.get('firstName')
					);
			}, function(err) {
				res.json({
					error: err.message
				});
			});
		},


	};
}
