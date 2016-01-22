/**
* Middleware functions for dashboard routes
*
* May need to eventually modularize this into a folder with individual middleware
* files when more stuff gets added.
*/

'use strict';

import Hacker from 'app/models/Hacker';

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

/**
* Returns a specific hacker
*/
export function getHacker(req, res, next) {
	Hacker.find(req.params.id).then(function(hacker) {
		req.log.info({ hacker: hacker }, 'Requested Hacker');
		req.hacker = hacker;
		next();
	},
	function(err) {
		req.log.warn({ err: err }, 'Error getting hacker');
		res.json({
			err: err
		});
	});
}
