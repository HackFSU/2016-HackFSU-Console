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
acl.role('Admin').canAccess(['User', 'Hacker', 'Mentor']);
acl.role('Super Admin').canAccess('Admin', true);

if(process.env.env === 'development')  {
	acl.verbose = true;
}


/**
 * Validatior w/ custom functions
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
