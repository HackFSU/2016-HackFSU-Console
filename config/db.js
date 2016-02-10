/**
* config/db.js
*
* Initializes and exports a connection to the database.
*
* EXPORTS:
* 	default (object): Object containing the connection to the database.
*/

import Sequelize from 'sequelize';

/**
* Configuration for database
* Most config set in .env file, exluding timezone (which is static as
* Tallahasee will most likely never not be in this timezone).

* NOTE: Timezone can be any valid timezone string recognized by moment.
*/
const dbconf = {
	dialect: process.env.DB_DIALECT,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	timezone: 'America/New_York'
};

// Initialize database connection
const db = new Sequelize(dbconf.database, dbconf.username, dbconf.password, {
	host: dbconf.host,
	port: dbconf.port,
	dialect: dbconf.dialect,
	timezone: dbconf.timezone
});

export default db;
