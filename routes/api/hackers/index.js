/**
* schools api routes
*/

'use strict';

import express from 'express';
import * as middleware from './middleware';

let router = express.Router();

router.route('/')
/**
* GET /api/hackers
*
* For now, this returns the full data of a hacker (all of its attributes +
* attributes from it's assoc. user).
* TODO: Allow query params to limit the returned data (easier load on server!)
*/
.get(
	middleware.getHackers,
	function(req, res, next) {
		res.json(req.hackers);
	}
);

router.route('/:id')
/**
* GET /api/hackers/:id
*
* Returns the data of an individual hacker
*/
.get(
	middleware.getHacker,
	function(req, res, next) {
		res.json(req.hacker);
	}
);

export default router;
