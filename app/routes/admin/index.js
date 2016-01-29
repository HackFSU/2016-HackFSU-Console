/**
 * Administration pages
 * /admin/*
 * TODO /admin/hackers
 * TODO /admin/mentors
 * TODO /admin/checkin
 * TODO /admin/schools
 */
'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
import hackers from 'app/routes/admin/hackers';
import schools from 'app/routes/admin/schools';

const router = express.Router();

router.all('*', acl.use('Admin')); // switch back to 'Admin' when ready


router.get('/', function(req, res) {
	res.render('admin/index');
});

router.use('/hackers', hackers);
router.use('/schools', schools);

/**
 * Acl debugging, load it if you get confused about the acl
 * By default it will use your acl key. Pass in a role to see stats about it.
 */
router.route('/acl')
.get(
	function(req, res, next) {
		res.locals.valid = true;
		req.session.user = req.session.user || {
			roleKey: acl.role('User').id
		};

		if(req.query.roleName && acl.getRoles()[req.query.roleName]) {
			req.session.user.roleKey = acl.role(req.query.roleName).id;
			res.locals.roleName = req.query.roleName;
		} else if(req.query.roleKey) {
			req.session.user.roleKey = parseInt(req.query.roleKey);
		}

		next();
	},
	acl.use(), // reloads locals.acl
	function(req, res) {
		res.json({
			checkedRole: res.locals.roleName || '<current>',
			roleKey: req.session.user.roleKey.toString(2),
			valid: res.locals.valid,
			acl: res.locals.acl,
			all: acl.getRoles()
		});
	}
);

export default router;
