/**
 * /admin/user/*
 *
 * Basic user admin page
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import User from 'app/models/User';
import { queryFind } from 'app/routes/util';
import WifiCred from 'app/models/WifiCred';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/users');
});

router.route('/list')
.get(
	queryFind(function() {
		let query = new Parse.Query(User);
		query.include([
			'wifiCred'
		]);
		query.select([
			'firstName',
			'lastName',
			'email',
			'github',
			'phone',
			'wifiCred.username',
			'wifiCred.password'
		]);
		return query;
	}, 2),
	function(req, res) {
		res.json({
			data: res.locals.queryResults
		});
	}
);

router.route('/giveWifiCreds')
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
		let query = new Parse.Query(User);
		query.equalTo('objectId', req.body.objectId);
		query.include([
			'wifiCred'
		]);
		query.select([
			'wifiCred.uername'
		]);
		return query;
	}, 2),

	// make sure a user has been found
	function(req, res, next) {
		if(!res.locals.queryResults.length) {
			res.json({
				error: `Invalid objectId "${req.body.objectId}"`
			});
			return;
		}

		// got obj
		let user = res.locals.user = res.locals.queryResults[0];

		if(user.get('wifiCred')) {
			// Already have keys, stop and return success
			res.json({
				message: 'Already have keys'
			});
			return;
		}
		next();
	},

	// Get a free key and assign it to the user (allow fsu)
	function(req, res, next) {
		let email = res.locals.email = res.locals.user.get('email');

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
			req.log.error('[users] Cannot get wifi cred:', err);
			next();
		});

	},

	// update the user status & save hacker/user/cred
	function(req, res, next) {
		let objs = [
			res.locals.user,
		];

		if(res.locals.cred) {
			objs.push(res.locals.cred);
		}

		Parse.Object.saveAll(objs).then(function() {
			next();
		}, function(err) {
			req.log.error('[users] Unable to save.', err);
			res.status(500);
			res.json({
				error: err
			});
		});
	},


	// TODO <trev> send email with keys


	// Send a success!
	function(req, res) {
		req.log.info(`[users] User ${res.locals.user.id} given wifi keys`);
		res.json({});
	}
);





export default router;
