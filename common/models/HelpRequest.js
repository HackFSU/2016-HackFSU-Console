/**
* HelpRequest model
*
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from '../lib/validate';

const PARSE_CLASSNAME = 'HelpRequest';

export default class HelpRequest extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let helpReq = new HelpRequest();
		o = validate(o, _.isObject);

		helpReq.set('name', o.name);
		helpReq.set('location', o.location);
		helpReq.set('description', o.description);

		return helpReq;
	}

	static findAll() {
		let promiseFindAll = new Parse.Promise();
		let query = new Parse.Query(HelpRequest);
		query.limit(500);
		query.find().then(function(req) {
			promiseFindAll.resolve(req);
		}, function(err) {
			promiseFindAll.reject(err);
		});

		return promiseFindAll;
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, HelpRequest);
