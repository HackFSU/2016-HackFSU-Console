/**
* Help requests routes
*
* Mentors can view help requests and choose to assign them to themselves.
* Makes use of Socket.io for real-time concurrency
*/

'use strict';

import express from 'express';
import { acl, queryFind, stdServerErrorResponse, redirectNot } from 'app/routes/util';
import HelpRequest from 'app/models/HelpRequest';
import Mentor from 'app/models/Mentor';
import User from 'app/models/User';
import Parse from 'parse/node';
// import * as middleware from 'app/routes/mentor/helprequests/middleware';

let router = express.Router();

router.use(
	acl.use('Mentor'),
	redirectNot('Mentor', '/mentor/userSignup')
);

router.route('/')
.get(
	// Display page
	function(req, res) {
		res.render('mentor/helprequests/index');
	}
);

router.route('/list')
.get(
	// load the help reqs
	queryFind(function() {
		let query = new Parse.Query(HelpRequest);
		query.include([
			'assignedMentor',
			'assignedMentor.user'
		]);
		query.select([
			'name',
			'description',
			'location',
			'assignedMentor',
			'assignedMentor.user',
			'assignedMentor.user.firstName',
			'assignedMentor.user.lastName',
		]);
		return query;
	}),

	// Return all reqs
	function(req, res) {
		res.json({
			data: res.locals.queryResults
		});
	}
);

router.route('/assignToMe')
.post(
	// validate
	function(req, res, next) {
		req.checkBody('helpRequestId').notEmpty();

		if(req.validationErrors()) {
			res.json({
				error: req.validationErrors()
			});
			return;
		}

		next();
	},

	// grab the request
	queryFind(function(req) {
		let query = new Parse.Query(HelpRequest);
		query.equalTo('objectId', req.body.helpRequestId);
		query.include([
			'assignedMentor',
			'assignedMentor.user'
		]);
		query.select([
			'assignedMentor',
			'assignedMentor.user',
			'assignedMentor.user.firstName',
			'assignedMentor.user.lastName',
		]);
		return query;
	}),

	// Make sure help request is assigned
	function(req, res, next) {
		if(res.locals.queryResults.length === 0) {
			res.json({
				error: `Invalid HelpRequest id "${req.body.helpRequestId}"`
			});
			return;
		}

		let helpRequest = res.locals.helpRequest = res.locals.queryResults[0];
		let assignedMentor = helpRequest.get('assignedMentor');

		if(assignedMentor) {
			// already assigned
			res.json({
				error: 'Help Request already assigned to ' + assignedMentor.get('user').getName()
			});
			return;
		}

		// needs to be assigned to current mentor
		next();
	},

	// get current mentor
	queryFind(function(req,res) {
		let query = new Parse.Query(Mentor);
		let user = new User();
		user.id = req.session.user.userId;
		user.set('objectId', user.id);
		query.equalTo('user', user);
		return query;
	}),

	// Save new mentor as assignedMentor
	function(req, res, next) {
		if(res.locals.queryResults.length === 0) {
			let msg = `No user found for mentor "${req.session.user.userId}"`;
			req.log.error(msg);
			res.status(500);
			res.json({
				error: msg
			});
			return;
		}

		let helpRequest = res.locals.helpRequest;
		let mentor = res.locals.queryResults[0];

		helpRequest.set('assignedMentor', mentor);
		helpRequest.save().then(function() {
			req.log.info(`[mentor] HelpRequest ${helpRequest.id} assigned to ${mentor.id}`);
			next();
		}, stdServerErrorResponse);
	},

	// TODO socket.io

	// success
	function(req, res) {
		res.json({});
	}
);


export default router;
