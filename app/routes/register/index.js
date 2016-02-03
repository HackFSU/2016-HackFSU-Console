/**
* Registration routes
*/

'use strict';

import express from 'express';
let router = express.Router();

import * as middleware from 'app/routes/register/middleware';

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ body: req.body });
	}

	next();
});

// Routes for /register
router.route('/')
// GET /register
// Shows the registration form
.get(function(req, res, next) {
	//res.render('registration/index');
	res.redirect('/#register');
})
// POST /register
// Create new registration
.post(
	function(req, res, next) {
		res.json({
			error: 'Registration is closed.'
		});
	},
	middleware.validateRegistration,
	middleware.signUpHacker,
	middleware.sendConfirmationEmail,
	function(req, res, next) {
		res.json(req.hacker);
	}
);

export default router;
