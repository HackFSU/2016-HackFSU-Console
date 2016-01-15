/**
* schools api routes
*/

'use strict';

import express from 'express';
import * as middleware from './middleware';

let router = express.Router();

router.route('/')
/**
* GET /api/schools
*
* Returns an array of json objects formatted as:
*		{
*			"Example State University": {
*					"count": 42,
*					"students": [
*							"First Last",
*							"Foo Bar"
*					]
*			}
*		}
*/
.get(
	middleware.getSchools,
	function(req, res, next) {
		res.json(req.schools);
	}
);


export default router;
