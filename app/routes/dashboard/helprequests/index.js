/**
* Help requests routes
*
* Mentors can view help requests and choose to assign them to themselves.
* Makes use of Socket.io for real-time concurrency
*/

'use strict';

import express from 'express';
import * as middleware from './middleware';

let router = express.Router();

router.route('/')
/**
* GET /dashboard/helprequests
*
* Render a table with all of the help requests currently open and assigned
*/
.get(
	function(req, res, next) {
		let data = {
			test: 'This is a test'
		};
		
		res.render('dashboard/helprequests/index', data);
	}
);

export default router;
