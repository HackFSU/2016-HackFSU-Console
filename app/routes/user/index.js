/**
 * Handles /user/* routing
 *
 * TODO /user/resetpassword
 */
'use strict';

import express from 'express';
import { acl, queryFind } from 'app/routes/util';
import * as middleware from 'app/routes/user/middleware';
import Parse from 'parse/node';
import User from 'app/models/User';
import store from 'app/store';


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
	middleware.redirectLoggedIn,
	function(req, res) {
		// Not a valid user
		req.session.destroy();

		res.render('user/login', {
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
		// redirect non-admin roles to respective pages
		let uAcl = res.locals.acl;
		if(uAcl.isRole.Admin) {
			next();
			return;
		}

		// Uncomment this when it is ready to auto redirect judges
		// if(uAcl.isRole.Judge) {
		//     res.redirect('/judge');
		//     return;
		// }

		next();
	},
	queryFind(function(req) {
		let query = new Parse.Query(User);
		query.equalTo('objectId', req.session.user.userId);
		query.include([
			'wifiCred'
		]);
		query.select([
			'firstName',
			'lastName',
			'github',
			'phone',
			'diet',
			'shirtSize',
			'email',
			'wifiCred.username',
			'wifiCred.password'
		]);
		return query;
	}),
	function(req, res) {
		// Flatten user object
		let userInstance = res.locals.queryResults[0];
		res.locals.user = {
			firstName: userInstance.get('firstName'),
			lastName: userInstance.get('lastName'),
			github: userInstance.get('github'),
			phone: userInstance.get('phone'),
			diet: userInstance.get('diet'),
			shirtSize: store.shirtSizes[userInstance.get('shirtSize')],
			email: userInstance.get('email'),
			wifiCred: userInstance.get('wifiCred'),
		};

		res.render('user/profile', {
			title: 'Profile',
			accessDenied: !!req.query.accessDenied,
		});
	}
);


router.route('/signup')
.get(
	acl.use(),
	middleware.redirectLoggedIn,
	function(req, res) {
		res.render('user/signup');
	}
)
.post(
	middleware.validateSignup,
	middleware.checkEmailUsed,
	middleware.signupNewUser,
	function(req, res) {
		res.json({});
	}
);


export default router;
