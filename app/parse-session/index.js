/**
 * Utility for managing the session cache, connecting Parse sessions to the
 * acl keys of the User class. 
 *
 * The User's roleKey for a given sessionId is cached. 
 *
 * Allows access to session role via req.roleKey.
 *
 * Parse must already be initialized before this is used.
 */

'use strict';

import Parse from 'parse/node';
import _ from 'lodash';

/**
 * Middleware to put retrieve and place roleKey into req.roleKey
 *
 * Expects sessionId to be in  
 */
export default function(getSessionId) {
	if(!_.isFunction(getSessionId)) {
		throw new Error('Requires getSessionId() param');
	}

	return function(req, res, next) {
		let sid = getSessionId(req);

		if(!sid) {
			next();
			return;
		}

		// Check sid 
		let query = Parse.query(Parse.Object.extend('Session'));
		query.equalTo('sessionToken', sid);
		query.include('user.roleKey');
		query.first().then(function(session) {
			req.roleKey = session.get('user.roleKey');
		}, function(err) {
			next();
		});
	};
}
