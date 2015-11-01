/**
 * Load any static data and constants
 */
'use strict';

import schoolData from './schools.json';


var store = {};

// Add all data to the store
store.HOST_NAME = 'hackfsu.com';

store.email = {
	FROM_EMAIL_NOREPY: 'noreply@' + exports.HOST_NAME,		// fake
	FROM_EMAIL_REGISTER: 'register@' + exports.HOST_NAME,	// fake
	FROM_EMAIL_INFO: 'info@' + exports.HOST_NAME,				// valid
	FROM_NAME: 'HackFSU'
};

store.links = {
	twitter: 'http://www.twitter.com/HackFSU',
	facebook: ''
};

store.schoolData = schoolData;

export default store; 