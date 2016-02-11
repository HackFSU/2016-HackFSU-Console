/**
* config/db.js
*
* Initializes and exports a connection to the database.
*
* EXPORTS:
* 	default (object): Object containing the connection to the database.
*/

'use strict';

import pgp from 'pg-promise';
import log from 'config/log';

// Initialize pg-promise
let pg = pgp({
	connect: function(client) {
		// Maybe do loggin here
	}
});

/**
* Configuration for database
* Most config set in .env file.
*/
const dbconf = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
};

// Initialize database connection
const db = pg(dbconf);

export default db;
