/**
* Mentor routes
*/

'use strict';

import express from 'express';
let router = express.Router();

import * as middleware from './middleware';

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		console.log(req.body);
	}

	next();
});

// Routes for /mentor
router.route('/')
// GET /register
// Shows the registration form
.get(function(req, res, next) {
	res.render('mentor/index', {
		title: 'Mentor Sign Up'
	});
})
// POST /mentor
// Create new registration
.post(
	middleware.validateMentorSignup,
	middleware.signUpMentor,
	middleware.sendConfirmationEmail,
	function(req, res, next) {
		res.json(req.mentor);
	}
);

export default router;
