/*Judge routes
*/

'use strict';

import express from 'express';
import { acl, redirectRoles, redirectNot } from 'app/routes/util';
import * as signup from 'app/routes/judge/signup';
import * as user from 'app/routes/user/middleware';
import moment from 'moment';

import judgeJudges from 'app/routes/judge/judges';
import judgeHacks from 'app/routes/judge/hacks';
import judgeResults from 'app/routes/judge/results';


let router = express.Router();


/**
 * Main judge page, where judges judge hacks
 */
router.route('/')
.get(
	acl.use('User'),
	redirectNot('Judge', '/judge/userSignup'),
	// acl.use('Judge'), // TODO figure out why Admins cant access this page

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
	acl.use('Mentor') // switch to Mentor when ready
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

router.use('/judges', acl.use('Admin'), judgeJudges);
router.use('/hacks', acl.use('Admin'), judgeHacks);
router.use('/results', acl.use('Admin'), judgeResults);


export default router;
