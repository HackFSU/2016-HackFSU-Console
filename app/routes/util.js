/**
 * Route utilites. Mantains standard instances throughout app.
 */

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import expressValidator from 'expressValidator';
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
		secure: false	// TODO: setup HTTPS for this
	}
});


/**
 * Request validation
 */
export const validator = expressValidator();


let acl = new Acl()

/**
 * Setup ACL
 * TODO: get role names/ids from db
 */
acl = new Acl(
	store.roles,
	function(req) {
		if(req.session && req.session.roleKey) {
			return req.session.roleKey;
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

export acl;