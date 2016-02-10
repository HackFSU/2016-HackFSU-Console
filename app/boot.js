/**
* app/boot.js
*
* Boots the HTTP & Socket.io servers based on configured Express app.
*
* EXPORTS:
* 	default (function): Script to boot an Express app passed in as an argument.
*/

'use strict';

import http from 'http';
import socketio from 'socket.io';


export default function(app) {
	const server = http.createServer(app);
	const port = normalizePort(app.get('port'));
	const log = app.get('log') || console;

	// Setup Socketi.io
	app.io = socketio(server);

	server.on('error', onError);
	server.on('listening', onListening);
	server.listen(port);

	function onError(error) {
		if(error.syscall !== 'listen') {
			throw error;
		}

		const bind = typeof port === 'string' ?
			'Pipe ' + port :
			'Port ' + port;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				log.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				log.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	function onListening() {
		const addr = server.address();
		const bind = typeof addr === 'string' ?
			'pipe ' + addr :
			'port ' + addr.port;
		log.info('Listening on ' + bind);
	}
}

function normalizePort(val) {
	const port = parseInt(val, 10);

	if(isNaN(port)) {
		// named pipe
		return val;
	}

	if(port >= 0) {
		// port number
		return port;
	}

	return false;
}
