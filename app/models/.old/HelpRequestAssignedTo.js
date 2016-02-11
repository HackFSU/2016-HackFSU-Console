/**
* HelpRequestAssignedTo model
* *DEPRECATED*
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'HelpRequestAssignedTo';

export default class HelpRequestAssignedTo extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}

	static new(helpReq, mentor) {
		let hrat = new HelpRequestAssignedTo();

		hrat.set('HelpRequest', helpReq);
		hrat.set('Mentor', mentor);

		return hrat;
	}


	static findAll() {
		let promiseFindAll = new Parse.Promise();
		let query = new Parse.Query(HelpRequestAssignedTo);
		query.limit(500);
		query.find().then(function(req) {
			promiseFindAll.resolve(req);
		}, function(err) {
			promiseFindAll.reject(err);
		});

		return promiseFindAll;
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, HelpRequestAssignedTo);
