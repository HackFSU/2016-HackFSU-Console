/**
 * /admin/hackers/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Hacker from 'app/models/Hacker';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/hackers');
});

router.route('/data')
.get(
	function(req, res, next) {
		let query = new Parse.Query(Hacker);
		query.limit(10000);
		query.include([
			'user'
		]);
		query.select([
			'school',
			'major',
			'firstHackathon',
			'hate',
			'major',
			'wants',
			'year',
			'wantjob',
			'comments',
			'yesno18',
			'status',
			'user.firstName',
			'user.lastName',
			'user.github',
			'user.phone',
			'user.email',
			'user.diet',
			'user.shirtSize'
		]);
		query.find().then(function(results) {
			res.locals.hackerData = results;
			next();
		}, function(err) {
			req.log.error(err);
			res.status(500);
			res.json({
				error: err,
			});
		});
	},
	function(req, res) {
		res.json({
			data: res.locals.hackerData
		});
	}
);


export default router;
