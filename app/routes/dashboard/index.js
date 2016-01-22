/**
* Dashboard module
*
* Admin dashboard for HackFSU website. Functionality is restrcited to admins
* (full access), with some access granted to mentors.
*/

'use strict';

import express from 'express';
import helprequests from 'app/routes/dashboard/helprequests';

let router = express.Router();

router.use('/helprequests', helprequests);

// router.route('/')
// // GET /dashboard
// // Dashboard index page
// .get(function(req, res, next) {
// 	res.send('Dashboard home');
// });



export default router;
