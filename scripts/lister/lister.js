'use strict';

var fs = require('fs');
var _ = require('lodash');


fs.readFile('./majors', function(err, data) {
	if (err) { throw err; }
	data = data.toString('utf8');
	data = data.split('\n');
	data.pop();			// Fucking annoying

	var list = [];

	_.each(data, function(school) {
		list.push('option ' + school);
		console.log('option ' + school);
	});
});
