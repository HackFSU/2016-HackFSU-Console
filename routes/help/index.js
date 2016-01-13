/**
* Help routes
*/

'use strict';

import express from 'express';
let router = express.Router();

import * as middleware from './middleware';

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
	res.render('help/index', {
		title: 'Help Request'
	});
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
