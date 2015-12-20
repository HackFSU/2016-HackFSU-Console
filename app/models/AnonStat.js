/**
 * AnonStat model
 *
 * Anonymous statistics collected from hackers. Parse only stores the integer
 * ids for each entry and not the names themselves. Names are in the store.
 */
'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from '../../lib/validate';

const PARSE_CLASSNAME = 'AnonStat';

export default class AnonStat extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);

		validate(o, _.isObject);
		validate(o.name, _.isString);
		validate(o.option, _.isString);

		this.set('name', o.name);
		this.set('option', o.option);
	}

}

	Parse.Object.registerSubclass(PARSE_CLASSNAME, AnonStat);
