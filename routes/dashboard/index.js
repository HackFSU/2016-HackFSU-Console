/**
* Dashboard module
*
* Admin dashboard for HackFSU website. Functionality is restrcited to admins
* (full access), with some access granted to mentors.
*/

'use strict';

import express from 'express';
import * as middleware from './middleware';

let router = express.Router();

// Eventually set this up to use the ACL.
// router.use();

router.route('/')
// GET /dashboard
// Dashboard index page
.get(function(req, res, next) {
	res.send('Dashboard home');
});


export default router;