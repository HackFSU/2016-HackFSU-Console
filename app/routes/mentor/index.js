/**
* Mentor routes
*/

'use strict';

import express from 'express';
let router = express.Router();

import * as middleware from 'app/routes/mentor/middleware';
import helprequests from 'app/routes/mentor/helprequests';
import { acl, redirectRoles } from 'app/routes/util';
import * as userMiddleware from 'app/routes/user/middleware';

// Mount helpreqs to /mentor
router.use('/helprequests', helprequests);

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ reqBody: req.body });
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

/**
 * User mentor signup
 */
router.route('/userSignup')
.all(
	acl.use('User'),
	redirectRoles('Mentor', '/mentor/helprequests')
)
.get(function(req, res) {
	res.render('mentor/userSignup');
})
.post(
	middleware.validateMentorUserSignup,
	middleware.signUpUserMentor,
	userMiddleware.addUserRole(function(req) {
		return req.session.user.userId;
	}, 'Mentor'),
	function(req, res, next) {
		res.json({});
	}
);

export default router;
