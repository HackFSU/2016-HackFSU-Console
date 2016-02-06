/**
 * /admin/judging/judges/*
 *
 * Handles Judge Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Judge from 'app/models/Judge';
import _ from 'lodash';
import { queryFind, stdServerErrorResponse } from 'app/routes/util';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('judge/judges');
});

/**
 * Grabs bulk judge data
 */
router.route('/list')
.get(
	queryFind(function() {
		let query = new Parse.Query(Judge);
		query.include([
			'user'
		]);
		query.select([
			'user.firstName',
			'user.lastName',
			'user.email',
			'user.phone',
			'createdAt',
			'status',
			'objectId'
		]);

		return query;
	}),
	function(req, res) {
		res.json({
			data: res.locals.queryResults
		});
	}
);

/**
 * Accepts a Judge request
 * - updates the status
 * - gives them access to judge stuff
 */
router.route('/accept')
.post(
	function(req, res, next) {
		req.checkBody('judgeId').notEmpty();

		if(req.validationErrors()) {
			res.json({
				error: req.validationErrors()
			});
			return;
		}
		next();
	},
	function(req, res, next) {
		Judge.accept(req.body.judgeId)
		.then(function() {
			req.log.info(`[/admin/judges/accept] Accepted Judge ${req.body.judgeId}`);
			next();
		})
		.catch(stdServerErrorResponse(req, res, `Unable to accept ${req.body.judgeId}`));
	},
	function(req, res) {
		res.json({});
	}

);


export default router;
