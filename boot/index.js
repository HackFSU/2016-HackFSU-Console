/**
 * Constuct & Start server
 */

'use strict';

import dotenv from 'dotenv';
import _ from 'lodash';
import configureApp from './config';
import setRoutes from './routes';


dotenv.load();

if(!_.isString(process.env.RUN_LEVEL)) {
	process.env.RUN_LEVEL = 'DEV';
}

// Configure
let app = configureApp();
setRoutes(app);

// Print Environment
console.log('**** ENVIRONMENT ****');

let projEnvs = [
	'PORT',
	'RUN_LEVEL',
	'PARSE_APP_ID',
	'PARSE_JS_KEY',
	'PARSE_MASTER_KEY',
	'MANDRILL_KEY',
	'SECRET',
	'SIGNUP_KEY'
];

projEnvs.forEach(function(name) {
	console.log('> '+ name + '= ' + process.env[name]);
});

console.log('---------------------');


// Start
app.server.listen(app.e.get('port'), function() {
	console.log('Listening on port ' + app.e.get('port') + '\n');
});
