/**
 * Route utilites. Mantains standard instances throughout app.
 */

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import expressValidator from 'expressValidator';

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