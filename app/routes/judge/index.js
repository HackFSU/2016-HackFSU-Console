/*Judge routes
*/

'use strict';

import express from 'express';
import { acl, redirectRoles, redirectNot, queryFind } from 'app/routes/util';
import * as signup from 'app/routes/judge/signup';
import * as user from 'app/routes/user/middleware';
import moment from 'moment';
import * as middleware from 'app/routes/judge/middleware';

import judgeJudges from 'app/routes/judge/judges';
import judgeHacks from 'app/routes/judge/hacks';
import judgeResults from 'app/routes/judge/results';

import Parse from 'parse/node';
import JudgeRound from 'app/models/JudgeRound';
import Judge from 'app/models/Judge';
import User from 'app/models/user';


let router = express.Router();


/**
 * Main judge page, where judges judge hacks
 */
router.route('/')
.get(
	acl.use('Judge'),

	queryFind(function(req) {
		let query = new Parse.Query(User);
		query.equalTo('objectId', req.session.user.userId);
		return query;
	}),

	// Grab the user
	function(req, res, next) {
		let user = res.locals.user = res.locals.queryResults[0];
		req.log.info('USER', user);
		next();
	},

	queryFind(function(req,res) {
		let query = new Parse.Query(Judge);
		query.equalTo('user', res.locals.user);
		return query;
	}),

	function(req, res, next) {
		if(!res.locals.queryResults) {
			req.log.info('NO JUDGE');
			res.locals.judge = '';
			next();
			return;
		}
		let judge = res.locals.judge = res.locals.queryResults[0];
		// req.log.info('JUDGE', judge);
		next();
	},

	queryFind(function(req, res) {
		let query = new Parse.Query(JudgeRound);
		query.equalTo('judge', res.locals.judge);
		query.equalTo('status', 'in progress');
		query.include([
			'hacks'
		]);
		return query;
	}),
	function(req, res, next) {
		if(!res.locals.queryResults) {
			req.log.info('NO ROUND');
			next();
			return;
		}
		let jround = res.locals.jround = res.locals.queryResults[0];
		// req.log.info('ROUND', jround);
		next();
	},

	function(req, res) {
		let hacks = [];

		// req.log.info(res.locals,'????');

		if(res.locals.queryResults.length) {
			let pHacks = res.locals.jround.get('hacks');
			pHacks.forEach(function(h) {
				hacks.push({
					name: h.get('name'),
					tableNumber: h.get('tableNumber'),
					objectId: h.id
				});
			});

		}

		req.log.info({hacks: hacks},'hacks for judge');
		let jround = res.locals.jround;

		res.render('judge/index', {
			hacks: hacks,
			roundId: jround? jround.id : '-1'
		});

	}
)
.post(
	function(req, res, next) {
		let data = res.locals.data = JSON.parse(req.body.data);
		if(!data.roundId ||
		!data.nominations ||
		!data.points) {
			res.json({
				error: 'Invalid'
			});
		}

		// console.log('body', data);
		next();
	},

	function(req, res, next) {
		let jround = new JudgeRound();
		jround.id = res.locals.data.roundId;
		jround.set('objectId', jround.id);
		jround.set('nominations', res.locals.data.nominations);
		jround.set('points', res.locals.data.points);
		jround.set('status', 'completed');
		jround.save().then(function() {
			console.log('FUCKIN SUBMITED');
			next();
		}, function(err) {
			res.status(500);
			res.json({
				error: err
			});
		});
	},

	function(req, res) {
		res.json({});
	}
);

/**
 * Admin page to create judge accounts.
 * Still need to be accepted in /admin/judges to complete process
 */
router.route('/signup')
.all(acl.use('Admin')) // We will make their accounts!
.get(function(req, res) {
	res.render('judge/signup', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	middleware.setFakeJudgeBody,
	user.validateSignup,
	user.checkEmailUsed,
	user.signupNewUser,
	signup.save,
	function(req, res) {
		res.json({});
	}
);

// For applying to become a judge for the current user
router.route('/userSignup')
.all(
	redirectRoles('Judge', '/judge'), // no need for them to be here
	acl.use('Mentor') // switch to Mentor when ready
)
.get(function(req, res) {
	res.render('judge/userSignup', {
		date: moment().format("MMMM DD, YYYY"),
	});
})
.post(
	signup.save,
	function(req, res) {
		res.json({});
	}
);

router.use('/judges', acl.use('Admin'), judgeJudges);
router.use('/hacks', acl.use('Admin'), judgeHacks);
router.use('/results', acl.use('Admin'), judgeResults);


export default router;
