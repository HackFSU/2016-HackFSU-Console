/**
 * Initialization file for app-wide store.
 *
 * TODO: Move any applicable data from here into the database and load them
 * on app start into the cache
 *
 * This is for server config data or data that is accessed a lot and would be
 * better cached.
 */
'use strict';

import schools from './data/schools.json';
import majors from './data/majors.json';
import anonStats from './data/anon-stats.json';

// store represents an object containing all static data to be used in the app
let store = {};

store.app = {
	name: 'HackFSU',
	host_name: 'hackfsu.com',
	copyright: `\u00a9 ${new Date().getFullYear()} HackFSU`		// Uses unicode value for copyright symbol
};

store.email = {
	noreply: 'noreply@' + store.HOST_NAME,
	register: 'register@' + store.HOST_NAME,
	info: 'info@' + store.HOST_NAME,
	from_name: 'HackFSU'
};

store.links = {
	twitter: 'http://www.twitter.com/HackFSU',
	facebook: 'https://www.facebook.com/hackfsu',
	instagram: 'https://www.instagram.com/hackfsu'
};

store.schools = schools;
store.majors = majors;
store.anonStats = anonStats;

store.shirtSizes = {
	'm-s': 'Men\'s Small',
	'm-m': 'Men\'s Medium',
	'm-l': 'Men\'s Large',
	'm-xl': 'Men\'s Extra Large',
	'm-2xl': 'Men\'s 2XL',
	'm-3xl': 'Men\'s 3XL',
	'w-s': 'Women\'s Small',
	'w-m': 'Women\'s Medium',
	'w-l': 'Women\'s Large',
	'w-xl': 'Women\'s Extra Large',
	'w-2xl': 'Women\'s 2XL',
	'w-3xl': 'Women\'s 3XL'
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
