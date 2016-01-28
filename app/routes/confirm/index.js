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

// Routes for /confirm/:id
router.route('/:id')
// GET /
// Shows the help
.get(function(req, res, next) {
	res.render('confirm/index', {
		title: 'Confirm Your Attendance!'
	});
})
// POST /confirm/:id
// Create new help request
.post(
	middleware.validateConfirmation,
	function(req, res, next) {
		res.json(req.helpReq);
	}
);

// Routes for /confirm/:email
// NOTE: This will ONLY be available for day-of checkins in which the hacker
// hasn't already confirmed. This way, they can easily confirm with just their
// email.
// TODO: Implement this

export default router;
