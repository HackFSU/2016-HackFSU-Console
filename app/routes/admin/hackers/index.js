/**
 * /admin/hackers/*
 *
 * Handles hacker Administration
 */
'use strict';

import express from 'express';

const router = express.Router();

router.route('/')
.get(function(req, res) {
	res.render('admin/hackers');
});

router.route('/data')
.get(function(req, res) {
	res.json([]);
});


export default router;
