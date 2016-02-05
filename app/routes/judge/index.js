/*Judge routes
*/

'use strict';

import express from 'express';
import { acl, redirectRoles } from 'app/routes/util';
import * as signup from 'app/routes/judge/signup';
import * as user from 'app/routes/user/middleware';
import moment from 'moment';

let router = express.Router();

/**
 * Main judge page, where judges judge hacks
 */
router.route('/')
.get(
	acl.use('Judge'),
	function(req, res) {
		res.render('judge/index', {
			date: moment().format("MMMM DD, YYYY"),
		});
	}
);

/**
 * Admin page to create judge accounts.
 * Still need to be accepted in /admin/judges to complete process
 */
router.route('/signup')
.all(acl.use('Admin')) // We will make their accounts!
.get(function(req, res) {
	res.render('judge/signup', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	user.validateSignup,
	user.checkEmailUsed,
	user.signupNewUser,
	signup.validate,
	signup.save,
	function(req, res) {
		res.json({});
	}
);

// For applying to become a judge for the current user
router.route('/userSignup')
.all(
	redirectRoles('Judge', '/judge'), // no need for them to be here
	acl.use('Admin') // switch to Mentor when ready
)
.get(function(req, res) {
	res.render('judge/userSignup', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	signup.validate,
	signup.save,
	function(req, res) {
		res.json({});
	}
);


export default router;
