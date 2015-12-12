/**
 * Load any static data and constants
 */
'use strict';

import schoolData from './schools.json';


var store = {};

// Add all data to the store
store.HOST_NAME = 'hackfsu.com';

store.email = {
	FROM_EMAIL_NOREPLY: 'noreply@' + exports.HOST_NAME,		// fake
	FROM_EMAIL_REGISTER: 'register@' + exports.HOST_NAME,	// fake
	FROM_EMAIL_INFO: 'info@' + exports.HOST_NAME,				// valid
	FROM_NAME: 'HackFSU'
};

store.links = {
	twitter: 'http://www.twitter.com/HackFSU',
	facebook: ''
};

store.schoolData = schoolData;

// List of stats and their option choices. Id's must be unique and remain
// unchanged. Ids are explicit to allow for easy changes
store.anonStats = {

	ethnicity: {
		id: 0,
		options: {
			option1: 0,
			option2: 1,
			option3: 2,
			option4: 3,
		}
	},

	gender: {
		id: 1,
		options: {
			Male: 0,
			Female: 1,
			Other: 2
		}
	}
};

export default store; 
