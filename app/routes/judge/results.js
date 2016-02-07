/**
 * /admin/judging/results/*
 *
 * Handles Judge Administration
 */
/* jshint -W083 */

'use strict';

import express from 'express';
import Parse from 'parse/node';
import { acl, queryFind } from 'app/routes/util';
import JudgeRound from 'app/models/JudgeRound';
import store from 'app/store';

const router = express.Router();

router.use(acl.use('Admin'));



router.route('/list')
.get(
	// grab all round data
	queryFind(function() {
		let query = new Parse.Query(JudgeRound);
		query.equalTo('status', 'completed');
		return query;
	}),

	// quantify
	function(req, res, next) {
		let scores = {
			top: {}
		};

		// init the categories
		store.hackCategories.forEach(function(cname) {
			scores[cname] = {};
		});

		function addCount(map, id) {
			if(id !== 0 && !id) {
				return;
			}

			if(!map[id]) {
				map[id] = 1;
			} else {
				map[id] += 1;
			}
		}

		// get the counts
		let jrounds = res.locals.queryResults;
		jrounds.forEach(function(round) {
			let points = round.get('points');
			let noms = round.get('nominations');

			points.forEach(function(id) {
				addCount(scores.top, id);
			});

			console.log('noms', noms);

			for(let cname in noms) {
				if(noms.hasOwnProperty(cname)) {
					addCount(scores[cname], noms[cname]);
				}
			}
		});

		req.log.info(scores);
		res.json({
			scores: scores
		});

	},

	// get top ten

	// return
	function(req, res) {
		res.json({});
	}
);

export default router;
