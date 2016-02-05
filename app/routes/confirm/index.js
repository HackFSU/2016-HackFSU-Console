/**
* Confirmation routes
*/

'use strict';

import express from 'express';
import * as middleware from './middleware';


let router = express.Router();

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.info({ request: req.body });
	}

	next();
});

// Routes for /confirm/:email
// NOTE: This will ONLY be available for day-of checkins in which the hacker
// hasn't already confirmed. This way, they can easily confirm with just their
// email.
router.route(/\/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/)
.get(
	function(req, res, next) {
		req.params.email = req.params[0];
		next();
	},
	middleware.checkPhoneSet,
	middleware.renderConfirmationPage
);

// Routes for /confirm/:id
router.route('/:id')
// GET /
// Shows the help
// TODO: Implement the phoneNotSet feature
.get(
	middleware.checkPhoneSet,
	middleware.renderConfirmationPage
);

router.route('/')
// POST /confirm
// Create new help request
.post(
	middleware.validateConfirmation,
	middleware.savePhoneIfSet,
	middleware.submitConfirmation,
	function(req, res, next) {
		res.json(req.confirmation);
	}
);

export default router;
