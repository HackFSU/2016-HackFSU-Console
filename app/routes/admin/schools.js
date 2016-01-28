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
	res.render('admin/schools');
});

router.route('/data')
.get(
	function(req, res, next) {
		let query = new Parse.Query(Hacker);
		query.limit(10000);
		query.select([
			'school'
		]);
		query.find().then(function(results) {
			res.locals.results = results;
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
			data: res.locals.results
		});
	}
);


export default router;
