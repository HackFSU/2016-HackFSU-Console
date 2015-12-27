/**
* Middleware functions for dashboard routes
*
* May need to eventually modularize this into a folder with individual middleware
* files when more stuff gets added.
*/

'use strict';

import _ from 'lodash';
import Hacker from 'common/models/Hacker';

/**
* Returns all hackers
*/
export function getHackers(req, res, next) {
	Hacker.findAll().then(function(hackers) {
		req.log.info({ hackers: hackers }, 'List of Hackers');
		req.hackers = hackers;
		next();
	},
	function(err) {
		req.log.warn({ err: err }, 'Error getting list of hackers');
		res.json({
			err: err
		});
	});
}
