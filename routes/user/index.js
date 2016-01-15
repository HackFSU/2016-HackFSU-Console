/**
* Mentor routes
*/

'use strict';

import express from 'express';
let router = express.Router();

import * as middleware from './middleware';

// Log the request body for all requests
router.use(function(req, res, next) {
	if (req.app.get('env') === 'development' && req.body) {
		req.log.debug({ reqBody: req.body });
	}

	next();
});

// Routes for /user/login
router.route('/login')
// GET /user/login
// Shows the login form
.get(function(req, res, next) {
	res.render('user/login', {
		title: 'Login'
	});
})
.post(function(req, res, next) {
	res.json(req.body);
});


export default router;
