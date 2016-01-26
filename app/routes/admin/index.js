/**
 * Administration pages
 * /admin/*
 * TODO /admin/hackers
 * TODO /admin/mentors
 * TODO /admin/checkin
 * TODO /admin/schools
 */
'use strict';

import express from 'express';
// import { acl } from 'app/routes/util';
import hackers from 'app/routes/admin/hackers';

const router = express.Router();

// router.all('*', acl.use('Admin'));

router.use('/hackers', hackers);

export default router;
