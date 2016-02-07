/**
 * Imports hacks from .csv and saved in db
 */
'use strict';

import { Converter } from 'csvtojson';
import Hack from 'app/models/Hack';
import Parse from 'parse/node';

const HACK_CSV = __dirname + '/../data/hacks.csv';

Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

let converter = new Converter({});

console.log('Reading hack data from', HACK_CSV);
converter.fromFile(HACK_CSV, function(err, result) {
	if(err) {
		console.error('Error reading .csv', err);
		return;
	}
	let hackData = trimData(result);

	console.log(`Found ${hackData.length} hacks`);

	// grab current hack list
	let query = new Parse.Query(Hack);
	query.select([
		'name',
		'tableNumber'
	]);
	query.find().then(function(currentHacks) {
		let currTableNumber = 1;

		console.log(`Already have ${currentHacks.length} hacks`);

		currentHacks.forEach(function(ch) {
			hackData.forEach(function(hd) {
				if(ch.get('name') === hd.name) {
					// delete it, no need for saving it
					hd.isAlreadyStored = true;
				}

				// maintain the next tbl number
				if(currTableNumber <= ch.get('tableNumber')) {
					currTableNumber = ch.get('tableNumber') + 1;
				}

			});
		});

		// Create new Hack objs
		let newHacks = [];
		hackData.forEach(function(hd) {
			if(!hd.isAlreadyStored) {
				newHacks.push(Hack.new({
					name: hd.name,
					team: hd.team,
					categories: hd.categories,
					tableNumber: currTableNumber++
				}));
			}
		});

		if(newHacks.length === 0) {
			console.log(`No new hacks to be added, exiting`);
			return;
		}

		console.log(`Saving ${newHacks.length} new hacks`);

		Parse.Object.saveAll(newHacks).then(function(saved) {
			console.log(`Successfully saved ${saved.length} hacks`);
		}, function(err) {
			console.error('Parse Error!', err);
		});

	}, function(err) {
		console.error('Parse Error!', err);
	});

});


// Takes only needed data and removes rest
function trimData(data) {
	let result = [];
	let names = [];

	data.forEach(function(row) {
		let saved = {
			name: row['Submission Title'],
			categories: row['Desired Prizes'],
			team: [] // list of names
		};

		let base = saved.name;
		let i = 1;
		while(names.indexOf(saved.name) !== -1) {
			saved.name = base + ` (${++i})`;
		}
		names.push(saved.name);

		// get array from categories
		saved.categories = saved.categories? saved.categories.split(', ') : [];

		// Get team member names (first + last)
		function getName(i) {
			let name = '';
			let prefix = i === 0? 'Submitter' : 'Team Member ' + i;

			name += row[prefix + ' First Name']? row[prefix + ' First Name'] : '';
			name += row[prefix + ' Last Name']? ' ' + row[prefix + ' Last Name'] : '';

			if(name) {
				saved.team.push(name);
			}
		}

		getName(0);
		getName(1);
		getName(2);
		getName(3);
		getName(4);
		getName(5);
		getName(6);

		result.push(saved);
	});

	return result;
}
