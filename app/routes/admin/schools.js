/**
 * /admin/hackers/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Hacker from 'app/models/Hacker';
import _ from 'lodash';

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
			'school',
			'status'
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
		let schools = {};
		let list = [];
		let statusNames = {};

		// get counts
		results.forEach(function(obj) {
			let name = obj.get('school');
			let status = obj.get('status');
			if(!schools[name]) {
				schools[name] = {
					count: 0,
					statuses: {}
				};
			}
			schools[name].count += 1;

			// append status (allow any status name)
			if(status) {
				// spaces -> underscores
				status = status.replace(/\s/g, '_');

				if(typeof statusNames[status] !== 'number') {
					statusNames[status] = 0; // default
				}
				if(!schools[name].statuses[status]) {
					schools[name].statuses[status] = 0;
				}
				schools[name].statuses[status] += 1;
			}

		});

		// build list
		for(let name in schools) {
			if(schools.hasOwnProperty(name)) {
				list.push({
					count: schools[name].count,
					name: name,
					statuses: _.defaults(schools[name].statuses, statusNames)
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
