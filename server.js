/**
* server.js
*
* Server initialization file. Starts the Express server located in the app/
* module and registers the code through the Babel ES6 interpretter, allowing the
* app to be run without compilation.
*
* EXPORTS: none
*/
'use strict';

require('app-module-path/register');	// allows app/* require() access
require('babel-register');              // allows ES6
require('./app').default();				// boots up express app
