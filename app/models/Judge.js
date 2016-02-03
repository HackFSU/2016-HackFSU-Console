/**
 * Judge class
 * - stores data needed about hackathon judges
 */

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';
import User from 'app/models/User';

const PARSE_CLASSNAME = 'Judge';

export default class Judge extends Parse.Object {
	constructor() {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let judge = new Judge();

		validate(o, _.isPlainObject);

		let user;
		if(o.userId) {
			// user already exists
			user = new User();
			user.id = validate(o.userId, _.isString);
		} else {
			validate(o.user, _.isObject);
			user = User.new(o.user);
		}

		// Judge attributes
		judge.set('mlhcoc', validate(o.mlhcoc, _.isBoolean));
		judge.set('user', user);

		return judge;
	}

}


 Parse.Object.registerSubclass(PARSE_CLASSNAME, Judge);
