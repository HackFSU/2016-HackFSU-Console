/**
* app/index.js
*
* Initializes Express app with app-wide settings, sets up routes, and boots the
* HTTP server.
*
* EXPORTS:
* 	default (function): Configuration script for Express app run by the server.
*/

'use strict';

import dotenv from 'dotenv';
import express from 'express';

import app from 'config/app';
import db from 'config/db';
import log from 'config/log';
//import routes from 'app/routes';
import boot from 'app/boot';


export default function() {

	// Load environment settings into the standard NodeJS process.env object.
	dotenv.load();

	// Log environment variables
	log.info({
		environment: dotenv.keys_and_values
	}, 'Custom Environment Values');


	// Serve routed content
	//routes(app);

	// Start the server
	boot(app);

}
