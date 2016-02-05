/**
* Middleware functions for /confirm routes
*/

'use strict';

import _ from 'lodash';
import Hacker from 'app/models/Hacker';
import Confirmation from 'app/models/Confirmation';
import moment from 'moment';


/**
* Middleware to display confirmation page
*/
export function renderConfirmationPage(req, res, next) {
	res.render('confirm/index', {
		title: 'Confirm Your Attendance!',
		date: moment().format("MMMM DD, YYYY"),
		phoneNotSet: req.phoneNotSet,
		hackerId: req.params.id
	});
}



/**
* Middleware function to check if the hacker supplied a phone number when he/she
* registered. If not, we need to set a flag so that we ask for it on the
* confirmation page.
*
* NOTE: This also has a nice side-effect of disabling the confirmation form if
* someone tries an invalid ID.
*
* Recently added: Now accept email instead of ID for day-of readiness.
*/
export function checkPhoneSet(req, res, next) {
	let promiseFind;
	req.log.info({ params: req.params }, 'URI Params');

	if (!!req.params.id) {
		promiseFind = Hacker.find(req.params.id);
	}
	else if (!!req.params.email) {
		promiseFind = Hacker.findByEmail(req.params.email);
	}

	promiseFind.then((hacker) => {
		const phone = hacker.get('user').get('phone');
		req.phoneNotSet = _.isEmpty(phone);
		next();
	}, (err) => {
		res.redirect('/no');
	});
}

/**
* Middleware to validate a confirmation submission.
* This is fairly trivial, but necessary. We also set some fields statically,
* because they are implied from submitting the confirmation form.
*/
export function validateConfirmation(req, res, next) {
	req.sanitizeBody('waiverSignature').trim();
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
* Middleware to save the phone number parameter for a hacker if it is set,
* since some people didn't enter their number when they registered.
* And because Trevor forgot to make it a required field :)
* If not set, we skip along happily to our next destination.
*/
export function savePhoneIfSet(req, res, next) {
	if (!_.isEmpty(req.body.phone)) {
		Hacker.find(req.body.hackerId).then((hacker) => {
			// Phone # is stored in the user object
			hacker.get('user').set('phone', req.body.phone);
			return hacker.get('user').save();
		})
		.then((hacker) => {
			return next();
		}, (err) => {
			res.json({
				error: err
			});
		});
	}
	// If we don't need to store the phone #, we skip along merrily
	else {
		next();
	}
}

/**
* Middleware to submit a confirmation.
* Stores the confirmation data in a Confirmation object.
* If we get an error, we send it and don't process the confirmation (which may
* caused some headaches if ever reached...)
*/
export function submitConfirmation(req, res, next) {
	// Pick the attrs we want for a confirmation
	const confirmAttrs = _.pick(req.body,
		'waiver',
		'waiverSignature',
		'mlhDataSharing',
		'hackerId'
	);

	// Create and save the confirmation object
	Confirmation.new(confirmAttrs).saveIt().then(function(confirmation) {
		req.log.info({ confirmation: confirmation }, 'Confirmation submitted');
		req.confirmation = confirmation;
		next();
	}, function(err) {
		req.log.info({ error: err }, 'Error submitting confirmation');
		res.json({
			error: err.message
		});
	});
}
