/**
* Middleware functions for /confirm routes
*/

'use strict';

import _ from 'lodash';
import Hacker from 'app/models/Hacker';
import Confirmation from 'app/models/Confirmation';


/**
* Middleware to validate a confirmation submission
*/
export function validateConfirmation(req, res, next) {
	req.sanitizeBody('waiver-signature').trim();
	req.sanitizeBody('phone').trim();		// Keep in mind this could be not-set

	// The following fields are assumed to be true automagically if they so choose
	// to submit our form.
	req.body.waiver = true;
	req.body.mlhDataSharing = true;

	// Validate fields
	req.checkBody('waiverSignature', 'Invalid signature').notEmpty().isAscii();
	req.checkBody('phone', 'Invalid phone').optional({ checkFalsy: true }).isAscii();

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
* Middleware to submit a confirmation
*
* Stores the confirmation data in a Confirmation object, but if the phone field
* is supplied, we go through the Hacker -> User to set this field.
*/
export function submitConfirmation(req, res, next) {

}
