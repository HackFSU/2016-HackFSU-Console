/**
* Middleware functions for register routes
*/

'use strict';

import _ from 'lodash';
import Hacker from '../../models/Hacker';
import AnonStat from '../../models/AnonStat';
import emailer from '../../lib/emailer.js';

/**
* Middleware function to validate registration form data.
* It first sanitizes some of the data,
*		{
*			trim whitespace from all
*			convert 'string' boolean values to actual booleans
*			ensure wants/wantjob is always an array or null (if not set)
*		},
* then separates the request into the req for the hacker and the req for the
* anonymous statistic. After that, we validate all the params and send an
* error response if there were errors, otherwise we continue along!
*/
export function validateRegistration(req, res, next) {
	// Sanitize some of the request first
	// Trim every param in the request
	_.each(req.body, function(val, key) {
		// .trim() for some reason destroys arrays
		if (!_.isArray(req.body[key])) {
			req.sanitizeBody(key).trim();
		}
	});
	req.sanitizeBody('firstHackathon').toBoolean();
	req.sanitizeBody('yesno18').toBoolean();
	req.sanitizeBody('mlhcoc').toBoolean();
	req.sanitizeBody('email').normalizeEmail({ lowercase: true });
	// Coerce single values into array
	req.body.wants = _.isArray(req.body.wants) || _.isEmpty(req.body.wantjob)
		? req.body.wants
		: [ req.body.wants ];
	req.body.wantjob = _.isArray(req.body.wantjob) || _.isEmpty(req.body.wantjob)
		? req.body.wantjob
		: [ req.body.wantjob ];
	// TODO: Add sanitizer to remove url part of github (if accidentally supplied)


	req.hacker = _.pick(req.body,
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

	req.anonStats = _.pick(req.body, 'ethnicity', 'gender');

	// Let's validate the request
	req.checkBody('firstName', 'Invalid first name').notEmpty().isAscii();
	req.checkBody('lastName', 'Invalid last name').notEmpty().isAscii();
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isAscii();
	req.checkBody('school', 'Invalid school').notEmpty().isAscii();
	req.checkBody('year', 'Invalid year').notEmpty().isAscii();
	req.checkBody('shirtSize', 'Invalid shirt size').notEmpty().isAscii();
	req.checkBody('major', 'Invalid major').notEmpty().isAscii();
	req.checkBody('firstHackathon', 'Invalid first hackathon selection')
		.notEmpty().isBoolean();
	req.checkBody('github', 'Invalid github username').optional({ checkFalsy: true }).isAscii();
	req.checkBody('resumeBase64', 'Invalid resume file').optional({ checkFalsy: true }).isBase64();
	req.checkBody('phone', 'Invalid phone number').optional({ checkFalsy: true }).isAscii();
	req.checkBody('hate', 'Invalid hate ').optional({ checkFalsy: true }).isAscii();
	req.checkBody('diet', 'Invalid diet').optional({ checkFalsy: true }).isAscii();
	req.checkBody('comments', 'Invalid comment').optional({ checkFalsy: true }).isAscii();
	_.each(req.body.wants, function(val, key) {
		req.checkBody(['wants', key], 'Invalid wants option')
			.optional({ checkFalsy: true})
			.isAscii();
	});
	_.each(req.body.wantjob, function(val, key) {
		req.checkBody(['wantjob', key], 'Invalid want job option')
			.optional({ checkFalsy: true})
			.isAscii();
	});
	req.checkBody('yesno18', 'Invalid yes/no 18 parameter').notEmpty().isBoolean();
	req.checkBody('mlhcoc', 'Invalid code of conduct parameter').notEmpty().isBoolean();
	req.checkBody('gender', 'Invalid gender').optional({ checkFalsy: true }).isAscii();
	req.checkBody('ethnicity', 'Invalid ethnicity').optional({ checkFalsy: true }).isAscii();

	if (req.validationErrors()) {
		res.json({
			error: req.validationErrors()
		});
	}
	else {
		next();
	}
}


/**
* Middleware function to sign up a new hacker.
* First, we set up anon stats in the form necessary for the AnonStat model.
* Then, we create a new Hacker object with the hacker request data. If that
* succeeds, we store all of the anonymous statistics and then continue on to the
* next task.
* If we receive an error when signing up the hacker, we send an error response
* and we don't continue on.
*/
export function signUpHacker(req, res, next) {
	// We're storing these values anonymously
	let anonStats = [
		{
			name: 'gender',
			option: req.anonStats.gender
		},
		{
			name: 'ethnicity',
			option: req.anonStats.ethnicity
		}
	];

	// Create a new Hacker object
	let hacker = Hacker.new(req.hacker);

	// Sign the new hacker up
	hacker.signUp().then(function(hacker) {
		req.hacker = hacker;

		// Save anonymous statistics anonymously
		_.each(anonStats, (stat) => {
			if (stat.option !== undefined) {
				let anonStat = new AnonStat(stat);
				anonStat.save().then((stat) => {
					req.log.info({ stat: stat }, 'Anon Stat saved successfully');
				},
				// We're not going to reject the request here if the anon stat isn't saved.
				// That would be silly.
				// "Sorry, Hacker. We couldn't store anonymous information about you,
				// so we're rejecting your registration. Good day!"
				(err) => {
					req.log.warn({ err: err }, 'Anon Stat not saved');
				});
			}
		});

		next();
	}, function(err) {
		// Uh oh... :(
		res.json({
			error: err.message
		});
	});
}

/**
* Middleware function to send confirmation email to newly signed up hacker.
* This only executes if a new hacker was saved successfully. It creates an email
* object to send to our emailer() library function, then attempts to send the email.
* If there is an error, we respond with an error and don't continue on, otherwise
* we log the success and continue along.
*/
export function sendConfirmationEmail(req, res, next) {
	let user = req.hacker.get('user');

	let email = {
		template: 'hackfsu-confirmation',
		content: [{}],
		message: {
			"subject": "See you this Spring!",
			"from_email": "registration@hackfsu.com",
			"from_name": "HackFSU",
			"to": [{
				"email": user.get('email'),
				"type": "to"
			}],
			"merge": true,
			"merge_language": "mailchimp",
			"global_merge_vars": [{
				"name": "firstname",
				"content": user.get('firstName')
			}]
		}
	};

	emailer(email, function(error) {
		if(error) {
			req.log.warn({type: 'Mandrill', err: error }, `Unable to send confirmation to "${user.get('email')}"`);
			res.json({
				error: error
			});
		}
		else {
			req.log.info({ type: 'Mandrill '}, `Confirmation email sent to "${user.get('email')}"`);
			next();
		}
	});
}
