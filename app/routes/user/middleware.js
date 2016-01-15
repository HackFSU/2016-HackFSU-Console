/**
 * Middleware for /user/*
 */

import User from 'app/models/user';

/**
 * Builds user session for valid users
 */
export function loginUser(req, res, next) {
	// TODO: build req.session.user object

	next();
}