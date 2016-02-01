/**
 * /admin/mentors/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Mentor from 'app/models/Mentor';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/mentors');
});

router.route('/list')
.get(
	function(req, res, next) {
		let query = new Parse.Query(Mentor);
		query.limit(10000);
		query.include([
			'user'
		]);
		query.select([
			'skills',
			'firstHackathon',
			'times',
			'affiliation',
			'comments',
			'user.email',
			'user.firstName',
			'user.lastName',
			'user.shirtSize',
			'user.phone',
			'user.diet',
			'user.comment'
		]);
		query.find().then(function(results) {
			res.json({
				data: results
			});
		}, function(err) {
			req.log.error('[/admin/updates/list] Error retrieving updates', err);
			res.status(500);
			res.json({
				error: err,
			});
		});
	}
);



export default router;
