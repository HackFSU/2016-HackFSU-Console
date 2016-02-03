/**
 * Handles /judge/* routing
 */
'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
import * as signup from 'app/routes/judge/signup';
import * as user from 'app/routes/user/middleware';
import moment from 'moment';

let router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('judge/index', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	user.validateSignup,
	user.checkEmailUsed,
	user.signupNewUser,
	signup.validate,
	signup.save,
	user.addUserRole(function(req, res) {
		return res.locals.user.objectId;
	}, 'Judge'),
	function(req, res) {
		res.json({});
	}
);

router.route('/userSignup')
.all(acl.use('User'))
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
