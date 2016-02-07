/**
 * /admin/judge/hacks/*
 *
 * Handles Hack Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Hack from 'app/models/Hack';
import { queryFind } from 'app/routes/util';

const router = express.Router();


router.route('/')
.get(function(req, res) {
	res.render('judge/hacks');
});

router.route('/list')
.get(
	// grab all hacks
	queryFind(function() {
		let query = new Parse.Query(Hack);
		query.select([
			'name',
			'tableNumber',
			'categories',
			'team'
		]);
		return query;
	}),

	// return data
	function(req, res) {
		res.json({
			data: res.locals.queryResults
		});
	}
);


export default router;
