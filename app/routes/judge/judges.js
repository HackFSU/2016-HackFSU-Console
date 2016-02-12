/**
 * /admin/judging/judges/*
 *
 * Handles Judge Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Judge from 'app/models/Judge';
import JudgeRound from 'app/models/JudgeRound';
import Hack from 'app/models/Hack';
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



let roundBlocked = false; // prevent this call from doing 2 at a time
function unblockingErrorHandlerCreator(req, res) {
	return function(err) {
		roundBlocked = false;
		req.log.error('[giveRound] roundBlocked');
		res.status(500);
		res.json({
			error: err
		});
	};
}


router.route('/giveRound')
.post(
	// validate
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

	// grab the Judge
	queryFind(function(req, res) {
		let query = new Parse.Query(Judge);
		query.equalTo('objectId', req.body.judgeId);
		return query;
	}),
	function(req, res, next) {
		if(!res.locals.queryResults.length) {
			res.json({
				error: 'No Judge found with id ' + req.body.judgeId
			});
			return;
		}

		let judge = res.locals.judge = res.locals.queryResults[0];

		if(judge.get('status') === 'pending') {
			res.json({
				error: `Judge ${judge.id} must be accepted first`
			});
			return;
		}

		next();
	},

	// make sure their round is over (if they have one) == none 'in progress'
	queryFind(function(req, res) {
		let query = new Parse.Query(JudgeRound);
		query.equalTo('judge', res.locals.judge);
		query.equalTo('status', 'in progress');
		return query;
	}),
	function(req, res, next) {
		if(res.locals.queryResults.length > 0) {
			res.json({
				error: 'Still in progress with a round',
				inProgress: true
			});
		} else {
			next();
		}
	},

	// All good, start process with a check for roundBlock
	function(req, res, next) {
		if(roundBlocked) {
			res.json({
				error: 'Server busy with other round assignment, wait a moment',
				blocked: true
			});
		} else {
			roundBlocked = true;
			next();
		}
	},

	// pull Hack objects not been judged by this person
	queryFind(function(req, res) {
		let query = new Parse.Query(Hack);
		query.notEqualTo('judgedBy', res.locals.judge);
		query.greaterThan('tableNumber', 39);

		return query;
	}, 1, unblockingErrorHandlerCreator),

	// create new JudgeRound
	function(req, res, next) {
		let judge = res.locals.judge;
		let pending = []; // will be saved later

		let availableHacks = res.locals.queryResults;
		if(!availableHacks.length) {
			roundBlocked = false;
			res.json({
				error: 'Judge has judged all hacks, or no matching hacks'
			});
			return;
		}

		// sort by amt of judges, asc
		availableHacks.sort(function(a, b) {
			a = a.get('judgedBy').length;
			b = b.get('judgedBy').length;
			if(a < b) {
				return -1;
			}
			if(a > b) {
				return 1;
			}
			return 0;
		});

		// grab first until have 3
		let assignedHacks = [];
		for(let i = 0; i < availableHacks.length && assignedHacks.length < 3; ++i) {
			assignedHacks[i] = availableHacks[i];
		}

		// make the round
		let jround = JudgeRound.new({
			judge: judge,
			hacks: assignedHacks
		});
		pending.push(jround);

		// add this judge to the judgedBy list on each hack
		assignedHacks.forEach(function(hack) {
			let jb = hack.get('judgedBy');
			jb.push(judge);
			req.log.info('prev', hack.get('judgedBy'), jb);
			hack.set('judgedBy', jb);
			pending.push(hack);
		});

		// make sure judge status has been changed
		if(judge.get('status') !== 'judging') {
			judge.set('status', 'judging');
			pending.push(judge);
		}

		req.log.info(`Assigning ${assignedHacks.length} hacks to Judge ${judge.id}`);

		// save pending updates
		Parse.Object.saveAll(pending).then(function() {
			next();
		}, unblockingErrorHandlerCreator(req, res));
	},


	// clear round block & return success
	function(req, res) {
		roundBlocked = false;
		res.json({});
	}
);


export default router;
