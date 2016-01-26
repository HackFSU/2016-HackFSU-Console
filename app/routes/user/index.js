/**
 * Handles /user/* routing
 *
 * TODO /user/logout
 * TODO /user/resetpassword
 */
'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
import * as middleware from 'app/routes/user/middleware';


const router = express.Router();
const userKey = acl.role('User').key;

router.route('/')
.get(
	function(req, res) {
		res.redirect('./profile' + (req.query.accessDenied ? '?accessDenied=true' : ''));
	}
);

router.route('/login')
.get(
	function(req, res) {
		if(req.session.user && acl.check(req.session.user.roleId, userKey)) {
			res.redirect('./profile' + (req.query.accessDenied ? '?accessDenied=true' : ''));
			return;
		}

		// Not a valid user
		req.session.destroy();

		res.render('user/login', {
			title: 'Login',
			accessDenied: !!req.query.accessDenied
		});
	}
)
.post(
	middleware.validateLogin,
	middleware.loginUser,
	function(req, res) {
		res.json({});
	}
);

router.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('./login');
});


router.route('/profile')
.get(
	acl.use('User'),
	middleware.loadUserData,
	function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			accessDenied: !!req.query.accessDenied,
		});
	}
);


export default router;
