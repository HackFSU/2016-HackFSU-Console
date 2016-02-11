/**
 * Submitted Hackathon projects
 * Should match up with Devpost Submissions
 */

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'Hack';

export default class Hack extends Parse.Object {
	constructor() {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let hack = new Hack();

		validate(o, _.isPlainObject);

		hack.set('name', validate(o.name, _.isString));
		hack.set('tableNumber', validate(o.tableNumber, _.isNumber));
		hack.set('categories', validate(o.categories, _.isArray));
		hack.set('team', validate(o.team, _.isArray));
		hack.set('judgedBy', []);

		return hack;
	}

}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Hack);
