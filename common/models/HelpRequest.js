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
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, HelpRequest);
