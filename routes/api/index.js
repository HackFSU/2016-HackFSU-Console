/**
* Dashboard module
*
* Admin dashboard for HackFSU website. Functionality is restrcited to admins
* (full access), with some access granted to mentors.
*/

'use strict';

import express from 'express';
import hackers from './hackers';

let router = express.Router();

router.use('/hackers', hackers);

export default router;
