/**
 * Server initialization. Sets up server process.
 *
 * Use this script to boot the server via cmd or require() it in a loader.
 */
'use strict';

require('app-module-path/register');	// allows app/* require() access
require('babel/register');					// allows ES6
require('app')();								// boots up express app
