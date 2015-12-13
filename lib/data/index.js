/**
 * Load any static data and constants
 *
 * TODO: Move any applicable data from here into the database and load them
 * on app start into the cache
 *
 * This is for server config data or data that is accessed a lot and would be
 * better cached.
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

store.shirtSizes = {
	'm-s': 'Men\'s Small',
	'm-m': 'Men\'s Medium',
	'm-l': 'Men\'s Large',
	'm-xl': 'Men\'s Extra Large',
	'w-s': 'Women\'s Small',
	'w-m': 'Women\'s Medium',
	'w-l': 'Women\'s Large',
	'w-xl': 'Women\'s Extra Large'
};

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

store.hackerGoals = {
	0: 'ios',
	1: 'android',
	2: 'frontend',
	3: 'backend',
	4: 'shelf',
	5: 'micro'
};

store.jobGoals = {
	0: 'internship',
	1: 'partTime', 
	2: 'fullTime'
};



/*****************************************************************************
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
			return;
		}

		// Find option
		let options = store.anonStats[pair.statId].options;
		for(let id in options) {
			if(options.hasOwnProperty(id) &&
				options[id] === optionName) {
				pair.optionId = id;
				return pair;
			}
		}
	},

	getHackerGoalId: function(name) {
		for(let id in store.hackerGoals) {
			if(store.hackerGoals[id] === name) {
				return id;
			}
		}
	},

	getJobGoalId: function(name) {
		for(let id in store.hackerGoals) {
			if(store.hackerGoals[id] === name) {
				return id;
			}
		}
	},

	// Returns an array of ids fromm an array of values
	getIdArray: function(arrayOfValues, loopkupFunction) {
		let id, arrayOfIds = [];

		arrayOfValues.forEach(function(value) {
			id = loopkupFunction(value);
			if(id) {
				arrayOfIds.push(id);
			} 
		});

		return arrayOfIds;
	}

};

export default store; 
