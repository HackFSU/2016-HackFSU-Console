/**
 * Handles /user/* routing
 */

import express from 'express';
import bodyParser from 'bodyParser';
import { parser, session, validator, acl } from 'app/router/util';
import * as middleware from './middleware';


let router = express.Router();

router.route('/')
.get(
	session,
	acl.use('User'),
	function(req, res) {
		res.redirect('/profile');
	}
);

router.route('/login')
.get(
	session,
	function(req, res) {
		if(req.session.user && req.session.user.roleKey > 0) {
			res.redirect('/user/profile' + req.query.accessDenied? '?accessDenied=true' : '');
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
	middleware.loginUser,
	function(req, res) {
		res.json({});
	}
);


router.route('/profile')
.get(
	session,
	acl.use('User'),
	function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			accessDenied: !!req.query.accessDenied
		})
	}
)

// TODO: reset password
