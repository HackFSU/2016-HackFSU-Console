/**
 * Administration pages
 * /admin/*
 */
'use strict';

import express from 'express';
import { parser, session, validator, acl } from 'app/routes/util';
import * as middleware from 'app/routes/admin/middleware';

const router = express.Router();

router.all('*', session, acl.use('Admin'));
router.post('*', parser, validator);

/**
 * General Utility page
 *
 * links w/ docs
 * how-to's
 */
router.get('/', function(req, res) {
    res.redirect('/admin/home');
});
router.get('/home', function(req, res) {
    res.render('/admin/home');
});




/**
 * Registration Statistics (current hackathon)
 *
 * dynamically loaded, fully searchable
 * school stats
 * registered hacker stats
 */
router.get('/regs', function(req, res) {
    res.render('/admin/regs');
});
router.get('/regs/schools', function(req, res) {
    res.json({
        data: []
    });
});
router.get('/regs/hackers', function(req, res) {
    res.json({
        data: []
    });
});
router.get('/regs/anonstats', function(req, res) {
    res.json({
        data: []
    });
});
router.get('/regs/counts', function(req, res) {
    res.json({
        data: []
    });
});

/**
 * Hackathon statistics
 *
 * general stats of all hackathons
 */
router.get('/hackathons');


/**
 * Hacker Details
 *
 * displays all hackers in db from any hackathon
 * past projects + teams
 * past hackathons
 */
router.get('/hackers');

// Specific hacker details
router.get('/hackers/:id');


/**
 *
 */
