/**
* config/log.js
*
* Creates an instance of the logger for use app-wide.
* See https://www.npmjs.com/package/bunyan for documentation on using Bunyan,
* the logging module used by this project.
*
* EXPORTS:
* 	default (object): Instance of the Bunyan logger to use app-wide.
*/

import bunyan from 'bunyan';

// App-wide logger
const log = bunyan.createLogger({ name: 'HackFSU' });

export default log;
