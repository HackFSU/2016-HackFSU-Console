/**
* Middleware functions for help requests
*/

'use strict';

import _ from 'lodash';
import HelpRequest from 'common/HelpRequest';

/**
* Middleware function to sanitize and validate help request body sent thru POST
*/
export function validateHelpRequest(req, res, next) {
	// Trim whitespace
	_.each(req.body, function(val, key) {
		req.sanitizeBody(key).trim();
	});

	req.checkBody('name', 'Invalid name').notEmpty().isAscii();
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('location', 'Invalid location').notEmpty().isAscii();
	req.checkBody('environment', 'Invalid environment').notEmpty().isAscii();
	req.checkBody('description', 'Invalid description').notEmpty().isAscii();

	if (req.validationErrors()) {
		res.json({
			errors: req.validationErrors()
		});
	}
	else {
		req.helpReq = req.body;
		next();
	}
}

/**
* Middleware function to submit a new help request via a POST req.
*
* TODO: List format that function accepts
*/
export function createHelpRequest(req, res, next) {
	HelpRequest.new(req.helpReq).save()
	.then(function(helpReq) {
		req.log.info({ helpReq: helpReq }, 'Help Request Created');
		req.helpReq = helpReq;
		next();
	}, function(err) {
		res.json({
			error: err.message
		});
	});
}
