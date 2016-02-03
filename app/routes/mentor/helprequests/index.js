/**
* Help requests routes
*
* Mentors can view help requests and choose to assign them to themselves.
* Makes use of Socket.io for real-time concurrency
*/

'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
import * as middleware from 'app/routes/mentor/helprequests/middleware';

let router = express.Router();

//router.use(acl.use('Mentor'));

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ reqBody: req.body });
	}

	next();
});


router.route('/')
/**
* GET /mentor/helprequests
*
* Render a table with all of the help requests currently open and assigned
*/
.get(
	middleware.getAllHelpRequests,
	function(req, res, next) {
		res.render('mentor/helprequests/index', {
			title: 'Help Requests',
			helpReqs: req.helpReqs
		});
	}
);


router.route('/:id/mentors/:mid')
/**
* POST /mentor/helprequests/:id/mentors/:mid
*
* Assigns a help request to the selected mentor
*/
.post(
	middleware.getHelpRequest,
	middleware.getMentor,
	middleware.createHelpRequestAssignedTo,
	function(req, res, next) {
		res.status(201);
		res.json({
			data: {
				helpReqAssignedTo: req.helpReqAssignedTo
			}
		});
	}
);


export default router;
