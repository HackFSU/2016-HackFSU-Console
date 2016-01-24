/**
 * Route utilites. Mantains standard instances throughout app.
 */
'use strict';

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import expressValidator from 'express-validator';
import Acl from 'lib/acl';
import store from 'app/store';

export const parser = {
	json: bodyParser.json(),
	urlencoded: bodyParser.urlencoded({
		limit: '2mb',
		extended: false
	})
};

/**
 * Initialize/Load session data
 * TODO: store sessions in MySQL db
 */
export const session = expressSession({
	secret: process.env.secret || 'BoopTheSnoot123',
	cookie: {
		maxAge: 172800000,
		secure: false	// TODO: setup HTTPS for this
	},
	resave: false,
	saveUninitialized: false
});


/**
 * Request validation
 */
export const validator = expressValidator();


/**
 * Setup ACL
 * TODO: get role names/ids from db
 */
export const acl = new Acl(
	store.roles,
	function(req) {
		if(req.session && req.session.user) {
			return +req.session.user.roleId;
		}
	},
	function(req, res) {
		res.redirect('/user/login?accessDenied=true');
	}
);

acl.role('Hacker').canAccess('User');
acl.role('Mentor').canAccess('User');
acl.role('Admin').canAccess(['User', 'Hacker', 'Mentor']);
acl.role('Super Admin').canAccess('Admin', true);
