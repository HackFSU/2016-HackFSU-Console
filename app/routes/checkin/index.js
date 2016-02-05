/**
* /checkin routes
*/

'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
// import * as middleware from 'app/routes/mentor/helprequests/middleware';

let router = express.Router();

router.use(acl.use('Admin'));

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ reqBody: req.body });
	}

	next();
});


router.route('/')
/**
* GET /checkin
*
*/
.get(
	// middleware.getAllHelpRequests,
	// middleware.getCurrentMentor,
	function(req, res, next) {
		res.render('checkin/index', {
			title: 'Check In'
			// helpReqs: req.helpReqs,
			// mentor: req.mentor
		});
	}
);


export default router;
