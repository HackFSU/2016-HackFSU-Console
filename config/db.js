/**
* Database configuration file.
*
*/

import Sequelize from 'sequelize';

const db = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	port: '5004',
	dialect: 'postgres',
	timezone: 'America/New_York'
});

export default db;
