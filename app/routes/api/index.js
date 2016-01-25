/**
* Dashboard module
*
* Admin dashboard for HackFSU website. Functionality is restrcited to admins
* (full access), with some access granted to mentors.
*/

'use strict';

import express from 'express';
//import hackers from './hackers';
import schools from './schools';

let router = express.Router();

//router.use('/hackers', hackers);
router.use('/schools', schools);

export default router;
