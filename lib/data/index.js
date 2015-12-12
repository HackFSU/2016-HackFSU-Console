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

// List of stats and their option choices.
// Ids are explicit to allow for verboseness. Do not change them once data
// has been collected.
store.anonStats = {

	0: {
		name: 'Ethnicity',
		options: {
			0: 'White',
			1: 'Asian',
			2: 'Hispanic',
			3: 'Multicultural',
			4: 'Other'
		}
	},

	1: {
		name: 'Gender',
		options: {
			0: 'Male',
			1: 'Female',
			2: 'Other'
		}
	}
};

/**
 * Utility functions for the datastore
 */
store.util = {
	getAnonStatId: function(statName) {
		for(let id in store.anonStats) {
			if(store.anonStats.hasOwnProperty(id) &&
				store.anonStats[id].name === statName) {
				return id;
			}
		}
	},

	/**
	 * Searches for the ids of the stat and option AnonStat pair by name. 
	 * Result object should be checked for statId & optionId
	 */
	getAnonStatIdPair: function(statName, optionName) {
		let pair = {};

		// Find stat
		pair.statId = store.util.getAnonStatId(statName);

		if(!pair.statId) {
			return pair;
		}

		// Find option
		let options = store.anonStats[pair.statId].options;
		for(let id in options) {
			if(options.hasOwnProperty(id) &&
				options[id] === optionName) {
				pair.optionId = id;
				break;
			}
		}

		return pair;
	}

};

export default store; 
