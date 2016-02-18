/**
 * For handling basic pages
 */
'use strict';

import express from 'express';
import path from 'path';

let router = express();

router.use(express.static(path.join(__dirname, '../public/static')));
// view engine setup
router.set('views', path.join(__dirname, '../../views'));
router.set('view engine', 'jade');

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../../../public/static/2015/index.html'));
});

export default router;
