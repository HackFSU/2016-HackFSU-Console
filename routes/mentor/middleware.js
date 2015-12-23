/**
* Helper functions for register routes
*/

'use strict';

import _ from 'lodash';
import Mentor from '../../models/Mentor';
import emailer from '../../lib/emailer.js';

/**
* Middleware function to validate mentor form data.
* It first sanitizes some of the data.
*		{
*			trim whitespace from all
*			convert 'string' boolean values to actual booleans
*			ensure availability is always an array or null (if not set)
*		}
* After that, we validate all the params and send an error response if there
* were errors, otherwise we continue along!
*/
export function validateMentorSignup(req, res, next) {
	// Sanitize some of the request first
	// Trim every param in the request
	_.each(req.body, function(val, key) {
		// .trim() for some reason destroys arrays
		if (!_.isArray(req.body[key])) {
			req.sanitizeBody(key).trim();
		}
	});
	req.sanitizeBody('firstHackathon').toBoolean();
	req.sanitizeBody('mlhcoc').toBoolean();
	req.sanitizeBody('email').normalizeEmail({ lowercase: true });
	// Coerce single values into array
	req.body.times = _.isArray(req.body.times) || _.isEmpty(req.body.times)
		? req.body.times
		: [ req.body.times ];

	// TODO: Add sanitizer to remove url part of github (if accidentally supplied)


	req.mentor = _.pick(req.body,
		'email',
		'firstName',
		'lastName',
		'password',
		'affiliation',
		'shirtSize',
		'firstHackathon',
		'github',
		'phone',
		'skills',
		'diet',
		'comments',
		'times',
		'mlhcoc'
	);

	// Let's validate the request
	req.checkBody('firstName', 'Invalid first name').notEmpty().isAscii();
	req.checkBody('lastName', 'Invalid last name').notEmpty().isAscii();
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isAscii();
	req.checkBody('affiliation', 'Invalid affiliation').notEmpty().isAscii();
	req.checkBody('shirtSize', 'Invalid shirt size').notEmpty().isAscii();
	req.checkBody('firstHackathon', 'Invalid first hackathon selection')
		.notEmpty().isBoolean();
	req.checkBody('github', 'Invalid github username').optional({ checkFalsy: true }).isAscii();
	req.checkBody('phone', 'Invalid phone number').optional({ checkFalsy: true }).isAscii();
	req.checkBody('diet', 'Invalid diet').optional({ checkFalsy: true }).isAscii();
	req.checkBody('skills', 'Invalid skills').notEmpty().isAscii();
	req.checkBody('comments', 'Invalid comment').optional({ checkFalsy: true }).isAscii();
	_.each(req.body.times, function(val, key) {
		req.checkBody(['times', key], 'Invalid times option')
			.optional({ checkFalsy: true})
			.isAscii();
	});
	req.checkBody('mlhcoc', 'Invalid code of conduct parameter').notEmpty().isBoolean();

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
* Middleware function to sign up a new mentor.
* We create a new Mentor object with the mentor request data.
* If we receive an error when signing up the mentor, we send an error response
* and we don't continue on.
*/
export function signUpMentor(req, res, next) {
	// Create a new Mentor object
	let mentor = new Mentor(req.mentor);

	// Sign the new hacker up
	mentor.signUp().then(function(mentor) {
		req.mentor = mentor;
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
	next();  // Uncomment when we have the registration email
	return;
	let email = {
		template: 'hackfsu-confirmation',
		content: [{}],
		message: {
			"subject": "See you this Spring!",
			"from_email": "registration@hackfsu.com",
			"from_name": "HackFSU",
			"to": [{
				"email": req.mentor.get('user').get('email'),
				"type": "to"
			}],
			"merge": true,
			"merge_language": "mailchimp",
			"global_merge_vars": [{
				"name": "firstname",
				"content": req.mentor.firstName
			}]
		}
	};

	emailer(email, function(error) {
		if(error) {
			req.log.warn({ type: 'Mandrill' }, `Unable to send confirmation to "${req.mentor.get('user').get('email')}"`);
			res.json({
				error: error
			});
		}
		else {
			req.log.info({ type: 'Mandrill'}, `Confirmation email sent to "${req.mentor.get('user').get('email')}"`);
			next();
			next();
		}
	});
}
