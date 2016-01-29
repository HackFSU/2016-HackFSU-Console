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
			next(results);
		}, function(err) {
			req.log.error(err);
			res.status(500);
			res.json({
				error: err,
			});
		});
	},
	function(results, req, res, next) {
		let counts = {};
		let list = [];

		// get counts
		results.forEach(function(obj) {
			let value = obj.get('school');
			if(!counts[value]) {
				counts[value] = 0;
			}
			++counts[value];
		});

		// build list
		for(let value in counts) {
			if(counts.hasOwnProperty(value)) {
				list.push({
					count: counts[value],
					value: value
				});
			}
		}

		res.locals.results = list;
		next();
	},
	function(req, res) {
		res.json({
			data: res.locals.results
		});
	}
);


export default router;
