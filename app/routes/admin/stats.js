/**
 * Handles /admin/stats/*
 *
 * For the the random statistics page
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Hacker from 'app/models/Hacker';
import AnonStat from 'app/models/AnonStat';
import Mentor from 'app/models/Mentor';
import Confirmation from 'app/models/Confirmation';
import User from 'app/models/User';
import Update from 'app/models/Update';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/stats');
});

router.route('/shirts')
.get(
	function(req, res, next) {
		let query = new Parse.Query(User);
		query.limit(10000);
		query.select([
			'shirtSize'
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

		// get counts
		results.forEach(function(obj) {
			let name = obj.get('shirtSize');
			if(!counts[name]) {
				counts[name] = 0;
			}
			counts[name] += 1;
		});

		res.json(counts);
	}
);


router.route('/anonstats')
.get(
	function(req, res, next) {
		let query = new Parse.Query(AnonStat);
		query.limit(10000);
		query.select([
			'name',
			'option'
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

		// get counts
		results.forEach(function(obj) {
			let name = obj.get('name');
			let option = obj.get('option');

			if(!counts[name]) {
				counts[name] = {};
			}
			if(typeof counts[name][option] !== 'number') {
				counts[name][option] = 0;
			}
			counts[name][option] += 1;
		});

		res.json(counts);
	}
);

router.route('/totals')
.get(
	getCount(User, 'Users'),
	getCount(Mentor, 'Mentors'),
	getCount(Hacker, 'Hackers'),
	getCount(Confirmation, 'Confirmations'),
	getCount(Update, 'Updates'),
	function(req, res) {
		res.json(res.locals.results);
	}
);


function getCount(parseClass, name) {
	return function(req, res, next) {
		let query = new Parse.Query(parseClass);
		query.limit(10000);

		query.count().then(function(results) {
			if(!res.locals.results) {
				res.locals.results = {};
			}
			res.locals.results[name] = results;
			next();
		}, function(err) {
			req.log.error(err);
			res.status(500);
			res.json({
				error: err,
			});
		});
	};
}


export default router;
