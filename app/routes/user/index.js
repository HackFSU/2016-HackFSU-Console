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

router.route('/')
.get(
	function(req, res) {
		res.redirect('/user/login');
	}
);

router.route('/login')
.get(
	acl.use(), // make locals.acl
	function(req, res) {
		if(req.session.user && res.locals.acl.canAccess.User) {
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
	res.redirect('/user/login');
});


router.route('/profile')
.get(
	acl.use('User'),
	function(req, res, next) {
		// TODO remove this, this is just temporary
		if(!res.locals.acl.canAccess.Admin) {
			req.session.destroy();
			res.redirect('/no?notReady=true');
			return;
		}
		next();
	},
	middleware.loadUserData,
	function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			accessDenied: !!req.query.accessDenied,
		});
	}
);


export default router;
