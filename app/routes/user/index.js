/**
 * Handles /user/* routing
 */
'use strict';

import express from 'express';
import { parser, session, acl, validator } from 'app/routes/util';
import * as middleware from 'app/routes/user/middleware';


const router = express.Router();

router.route('/')
.get(
	function(req, res) {
		res.redirect('/profile');
	}
);

router.route('/login')
.get(
	session,
	function(req, res) {
		if(req.session.user && req.session.user.roleKey > 0) {
			res.redirect('/user/profile' + req.query.accessDenied ? '?accessDenied=true' : '');
			return;
		}

		// Not a valid user
		req.session.user = undefined;

		res.render('user/login', {
			title: 'Login',
			accessDenied: !!req.query.accessDenied
		});
	}
)
.post(
	session,
	parser.json,
	validator,
	middleware.validateLogin,
	middleware.loginUser,
	function(req, res) {
		res.json({});
	}
);


router.route('/profile')
.get(
	session,
	acl.use('User'),
	middleware.loadUserData,
	function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			accessDenied: !!req.query.accessDenied,
		});
	}
);

// TODO: reset password

export default router;
