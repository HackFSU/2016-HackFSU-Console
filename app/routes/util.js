/**
 * Route utilites. Mantains standard instances throughout app.
 */
'use strict';

import Acl from 'lib/acl';
import store from 'app/store';
import expressValidator from 'express-validator';
import _ from 'lodash';

/**
 * Setup ACL
 * TODO: get role names/ids from db
 */
export const acl = new Acl(
	store.roles,
	function(req) {
		if(req.session && req.session.user) {
			return +req.session.user.roleKey;
		}
	},
	function(req, res) {
		res.redirect('/user/login?accessDenied=true');
	}
);

acl.role('Hacker').canAccess('User');
acl.role('Mentor').canAccess('User');
acl.role('Judge').canAccess('User');
acl.role('Admin').canAccess(['User', 'Hacker', 'Mentor', 'Judge']);
acl.role('Super Admin').canAccess('Admin', true);


if(process.env.env === 'development')  {
	acl.verbose = true;
}


/**
 * Validatior w/ custom functions
 * Can be used just like normal
 */
export const validator = expressValidator({
	customSanitizers: {
		toPhoneString: function(value) {
			return String(value).replace(/[^0-9]/g, '');
		}
	},
	customValidators: {
		isArray: function(value) {
			return Array.isArray(value);
		},

		isShirtSize: function(value) {
			return _.isString(value) &&
				store.shirtSizes.hasOwnProperty(value);
		},
	}
});


/**
 * Merge one or more queries into one call
 * Results unioned and put into req.locals.queryChainResults
 * Returns middleware that calls next() after queries are completed
 */
export function queryFind(queryMaker, numPages, errorHandler) {
	return function(req, res, next) {
		let queries = [];

		if(!numPages || numPages < 1) {
			numPages = 1;
		}

		for(let i = 0; i < numPages; ++i) {
			let query = queryMaker(req, res);
			query.skip(i*1000);
			query.limit(1000);
			queries.push(query);
		}

		res.locals.queryResults = [];

		if(queries.length === 0) {
			next();
			return;
		}

		if(!errorHandler) {
			errorHandler = stdServerErrorResponse(req, res, 'Parse Error');
		}

		let queryPromises = [];
		queries.forEach(function(query, i) {
			queryPromises.push(new Promise(function(resolve, reject) {
				query.find().then(function(results) {
					resolve(results);
				}, function(err) {
					reject(err);
				});
			}));
		});

		Promise.all(queryPromises)
		.then(function(results) {
			let all = [];
			results.forEach(function(result) {
				all = _.union(all, result);
			});

			res.locals.queryResults = all;
			next();
		})
		.catch(errorHandler);
	};
}


// Generates a closure for standard server error handling
export function stdServerErrorResponse(req, res, logMessage) {
	return function(err) {
		logMessage = `[${req.baseUrl}] ${logMessage}`;
		req.log.error(logMessage, err, err? err.stack : '<no stack>');
		res.status(500);
		res.json({
			error: err,
			message: logMessage
		});
	};
}


/**
 * Generates middleware for easy redirects
 * Users that match a role in roleNames[] will be redirected to redirectUrl
 */
export function redirectRoles(roleNames, redirectUrl) {
	let checkKey = 0;

    if(typeof roleNames === 'string') {
        roleNames = [roleNames];
    }

	// get the final checkKey
	roleNames.forEach(function(roleName) {
		checkKey = acl.addKeys(checkKey, acl.role(roleName).id);
	});

	return function(req, res, next) {
		if(req.session.user && acl.checkKeys(checkKey, req.session.user.roleKey)) {
			res.redirect(redirectUrl);
		} else {
			next();
		}
	};
}
