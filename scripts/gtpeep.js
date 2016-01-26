/**
* Script to send emails to people who registered last year but have yet to
* register this year.
*
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import Hacker from 'common/models/hacker';

Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

let query = new Parse.Query(Hacker);
query.limit(300);
query.include('user');
query.equalTo('school', 'Georgia Institute of Technology');
query.find().then(function(gtpeeps) {
	console.log(gtpeeps.length);

	_.each(gtpeeps, function(gtpeep) {
		let theuser = gtpeep.get('user');
		console.log(`${theuser.get('firstName')} ${theuser.get('lastName')} - ${theuser.get('email')}`);
	});
});
