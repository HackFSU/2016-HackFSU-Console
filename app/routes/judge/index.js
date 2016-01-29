/**
* Judge routes
*/

'use strict';

import express from 'express';
let router = express.Router();


// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ reqBody: req.body });
	}

	next();
});

// Routes for /mentor
router.route('/')


// GET /judge
// Shows the registration form
.get(function(req, res, next) {
	res.render('judge/index', {
		title: 'Judges'
	});
})

// INSERT: pull assigned hack #s here for judges


export default router;
