/**
 * Server initialization. Sets up server process.
 *
 * Run with 'babel-node --presets es2015 server.js' or use 'npm start'
 */
'use strict';

require('app-module-path/register');	// allows app/* require() access
require('babel-register');              // allows ES6
require('./app').default();				// boots up express app
