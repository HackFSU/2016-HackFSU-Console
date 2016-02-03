/**
* Judge routes
*/

'use strict';

import express from 'express';
import { acl, redirectRoles } from 'app/routes/util';
import * as signup from 'app/routes/judge/signup';
import * as user from 'app/routes/user/middleware';
import moment from 'moment';

let router = express.Router();

// Do we need this?
// // Log the request body for all requests
// router.use(function(req, res, next) {
// 	if (req.app.get('env') === 'development' && req.body) {
// 		req.log.debug({ reqBody: req.body });
// 	}
//
// 	next();
// });

router.route('/')
.get(
	redirectRoles(['Judge'], '/judge/hacks'),
	redirectRoles(['User'], '/judge/userSignup'),
	function(req, res) {
		res.render('judge/index', {
			date: moment().format("MMMM DD, YYYY"),
		});
	}
)
.post(
	user.validateSignup,
	user.checkEmailUsed,
	user.signupNewUser,
	signup.validate,
	signup.save,
	function(req, res) {
		res.json({});
	}
);

router.route('/userSignup')
.all(acl.use('User'))
.get(function(req, res) {
	res.render('judge/userSignup', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	signup.validate,
	signup.save,
	function(req, res) {
		res.json({});
	}
);

// page where the judgin happens
router.route('/hacks')
.get(
	acl.use('Judge'),
	function(req, res) {
		res.render('judge/hacks');
	}
);

// export default router;
