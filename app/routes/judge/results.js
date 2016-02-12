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
import Hack from 'app/models/Hack';

const router = express.Router();

router.use(acl.use('Admin'));



router.route('/')
.get(
	// grab all round data
	queryFind(function() {
		let query = new Parse.Query(JudgeRound);
		query.equalTo('status', 'completed');
		return query;
	}, 2),

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

		// Created Arrays
		let hackObjs = [];
		let hackMap = {}; // id: [refs]
		let sortedScores = {};
		for(let cname in scores) {
			if(scores.hasOwnProperty(cname)) {
				let cat = sortedScores[cname] = [];

				// add [count, id]
				for(let id in scores[cname]) {
					if(scores[cname].hasOwnProperty(id)) {
						sortedScores[cname].push([
							scores[cname][id],
							id
						]);
					}
				}

				// sort them (desc)
				cat.sort(function(a, b) {
					a = a[0];
					b = b[0];
					if(a > b) {
						return -1;
					}
					if(a < b) {
						return 1;
					}
					return 0;
				});

				// reduce to top 15 by removing >15
				cat.splice(10, cat.length - 10);

				// Create objects to fetch & keep ptrs for recall
				cat.forEach(function(hack) {
					let obj = new Hack();
					obj.id = hack[1];
					obj.set('objectId', obj.id);

					if(!hackMap[hack[1]]) {
						hackMap[hack[1]] = [];
					}
					hackMap[hack[1]].push(hack);
					hackObjs.push(obj);
				});

			}
		}

		// Load em all!
		Parse.Object.fetchAll(hackObjs).then(function(results) {

			// Match update arrays with data!
			results.forEach(function(obj) {
				if(hackMap[obj.id]) {
					// push to all matchs
					hackMap[obj.id].forEach(function(row) {
						row.push({
							name: obj.get('name'),
							tableNumber: obj.get('tableNumber')
						});
					});
					hackMap[obj.id] = false;
				}
			});

			req.log.info({sortedScores: sortedScores}, 'scores');
			// res.render('judge/results', {
			// 	sortedScores: sortedScores
			// });
			res.json({
				sortedScores: sortedScores
			});

		}, function(err) {
			req.log.error('ERROR FETCHING', err);
			res.status(500);
			res.json({
				error: err
			});
		});

	}

);

export default router;
