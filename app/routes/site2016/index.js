/**
 * For handling basic pages
 */
'use strict';

import express from 'express';
import path from 'path';
import store from 'app/store';

let router = express();

router.use(express.static(path.join(__dirname, '../public/static')));
// view engine setup
router.set('views', path.join(__dirname, '../../views'));
router.set('view engine', 'jade');

router.locals.store = store;

router.get('/', function(req, res) {
	res.render('index/index');
});

export default router;
