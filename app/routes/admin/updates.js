/**
 * /admin/hackers/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';
import Parse from 'parse/node';
import Update from 'app/models/Update';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/updates');
});

router.route('/list')
.get(
	function(req, res, next) {
		let query = new Parse.Query(Update);
		query.limit(10000);
		query.select([
			'title',
			'subtitle',
			'createdAt'
		]);
		query.find().then(function(results) {
			res.json({
				data: results
			});
		}, function(err) {
			req.log.error('[/admin/updates/list] Error retrieving updates', err);
			res.status(500);
			res.json({
				error: err,
			});
		});
	}
);

router.route('/send')
.post(
	function(req, res, next) {
		req.checkBody('title').notEmpty();
		req.checkBody('subtitle');
		req.checkBody('sendPush').isBoolean();

		if(req.validationErrors()) {
			res.json({
				error: req.validationErrors()
			});
			return;
		}
		next();
	},
	function(req, res) {
		Update.new(
			req.body.title,
			req.body.subtitle,
			req.body.sendPush === 'true'
		).then(function() {
			res.json({});
		}).catch(function(err) {
			req.log.error('[/admin/updates/send] Error saving update', err);
			req.status(500);
			res.json({
				error: err
			});
		});
	}
);

router.route('/delete')
.post(
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
	function(req, res) {
		Update.get(req.body.objectId)
		.then(function(update) {
			update.destroy()
			.then(function() {
				res.json({});
			}, function(err) {
				res.json({
					error: err
				});
			});
		})
		.catch(function(error) {
			res.json({
				error: error
			});
		});
	}
);


export default router;
