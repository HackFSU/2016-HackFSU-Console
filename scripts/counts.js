/**
 * Simple school name/count grab
 */
'use strict';

import Parse from 'parse/node';

const COUNT_CLASS_NAME = process.env.COUNT_CLASS_NAME;
const COUNT_COL_NAME = process.env.COUNT_COL_NAME;

if(!COUNT_CLASS_NAME) {
	throw new Error('Missing env COUNT_CLASS_NAME');
}
if(!COUNT_COL_NAME) {
	throw new Error('Missing env COUNT_COL_NAME');
}

console.log(`Getting "${COUNT_COL_NAME}" counts from "${COUNT_CLASS_NAME}" ...`);

// setup parse
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

// make query
let query = new Parse.Query(Parse.Object.extend(COUNT_CLASS_NAME));
query.limit(10000);
query.select(COUNT_COL_NAME);
query.find().then(function(results) {
	let counts = {};
	let list = [];

	// get counts
	results.forEach(function(obj) {
		let value = obj.get(COUNT_COL_NAME);
		if(!counts[value]) {
			counts[value] = 0;
		}
		++counts[value];
	});

	// build list
	for(let value in counts) {
		if(counts.hasOwnProperty(value)) {
			list.push({
				count: counts[value],
				value: value
			});
		}
	}

	console.log(new Date());
	console.log(COUNT_CLASS_NAME, results.length);
	console.log(COUNT_COL_NAME, list.length);
	console.log();

	sort('value');
	console.log('Sorted by value');
	print();

	sort('count');
	console.log('Sorted by count');
	print();

	function sort(prop) {
		list.sort(function(a, b) {
			if(a[prop] < b[prop]) {
				return -1;
			}
			if(a[prop] > b[prop]) {
				return 1;
			}
			return 0;
		});
	}

	function print() {
		list.forEach(function(item) {
			console.log(item.count, item.value);
		});
		console.log();
	}

}, function(err) {
	throw new Error(err);
});
