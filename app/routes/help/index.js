/**
* Help routes
*/

'use strict';

import express from 'express';
import * as middleware from 'app/routes/help/middleware';


let router = express.Router();

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.info({ request: req.body });
	}

	next();
});

// Routes for /help
router.route('/')
// GET /
// Shows the help
.get(function(req, res, next) {
	res.render('help/index');
})
// POST /help
// Create new help request
.post(
	middleware.validateHelpRequest,
	middleware.createHelpRequest,
	function(req, res, next) {
		res.json(req.helpReq);
	}
);

export default router;
