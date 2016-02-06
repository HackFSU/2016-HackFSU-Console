/**
 * /admin/hackers/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Hacker from 'app/models/Hacker';
import { queryFind } from 'app/routes/util';
import WifiCred from 'app/models/WifiCred';
import User from 'app/models/User';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/hackers');
});

router.route('/list')
.get(
	queryFind(function() {
		let query = new Parse.Query(Hacker);
		query.limit(10000);
		query.include([
			'user',
			'user.wifiCred'
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
			'user.shirtSize',
			'resume',
			'user.wifiCred.password',
			'user.wifiCred.username'
		]);
		return query;
	}, 2),
	function(req, res) {
		res.json({
			data: res.locals.queryResults
		});
	}
);

router.route('/checkin')
.post(
	// validate
	function(req, res, next) {
		req.checkBody('objectId').notEmpty();

		if(req.validationErrors()) {
			res.json({
				error: req.validationErrors()
			});
			return;
		}
		next();
	},

	// load the user data
	queryFind(function(req, res) {
		let query = new Parse.Query(Hacker);
		query.equalTo('objectId', req.body.objectId);
		query.include([
			'user'
		]);
		query.select([
			'status',
			'user.email'
		]);
		return query;
	}),

	// make sure a user has been found
	function(req, res, next) {
		if(!res.locals.queryResults.length) {
			res.json({
				error: `Invalid hacker "${req.body.objectId}"`
			});
			return;
		}

		// got a hacker!
		let hacker = res.locals.hacker = res.locals.queryResults[0];

		if(hacker.get('status') === 'checked in') {
			// Already checked in, stop and return success
			res.json({
				message: 'Already checked in'
			});
			return;
		}

		// build user instance obj
		let userData = hacker.get('user');
		let user = res.locals.user = new User();
		user.id = userData.objectId;
		user.set('email', userData.email);

		next();
	},

	// Get a free key and assign it to the user (non-fsu only)
	function(req, res, next) {
		let email = res.locals.email = res.locals.user.get('email');
		if(email.match(/^.*@.*fsu\.edu$/i)) {
			// is fsu student, doesnt need a creds
			next();
			return;
		}

		WifiCred.getUnassigned()
		.then(function(cred) {
			res.locals.user.set('wifiCred', cred);
			cred.set('assigned', true);
			cred.set('user', res.locals.user);
			res.locals.cred = cred;
			next();
		})
		.catch(function(err) {
			// keep the request going, but log it
			req.log.error('[checkin] Cannot get wifi cred:', err);
			next();
		});

	},

	// update the user status & save hacker/user/cred
	function(req, res, next) {
		let objs = [
			res.locals.user,
			res.locals.hacker
		];

		if(res.locals.cred) {
			objs.push(res.locals.cred);
		}

		res.locals.hacker.set('status', 'checked in');

		Parse.Object.saveAll(objs).then(function() {
			next();
		}, function(err) {
			req.log.error('[checkin] Unable to save.', err);
			res.status(500);
			res.json({
				error: err
			});
		});
	},


	// TODO <trev> send email with keys


	// Send a success!
	function(req, res) {
		req.log.info(`[hackers] Hacker ${res.locals.hacker.id} checked in`);
		res.json({});
	}
);





export default router;
