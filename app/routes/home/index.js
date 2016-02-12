/**
 * For handling basic pages
 */
'use strict';

import express from 'express';

let router = express.Router();

router.get('/', function(req, res) {
	res.render('itsover/index');
});

export default router;
