/**
 * Setup environment and launch
 */

'use strict';

var dotenv = require('dotenv');

dotenv.load();
if(!process.env.RUN_LEVEL) {
	process.env.RUN_LEVEL = 'DEV';
}

require('babel/register');
require('./boot');
