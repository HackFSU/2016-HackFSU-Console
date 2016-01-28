/**
* Confirmation model
*
*/

'use strict';

import Parse from 'parse/node';
import _ from 'lodash';
import validate from 'lib/validate';
import Hacker from 'app/models/Hacker';

const PARSE_CLASSNAME = 'Confirmation';

export default class Confirmation extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let confirm = new Confirmation();

		validate(o, _.isPlainObject);
		confirm.set('waiver', validate(o.waiver, _.isBoolean));
		confirm.set('waiver-signature', validate(o.waiverSignature, _.isString));
		confirm.set('mlhDataSharing', validate(o.mlhDataSharing, _.isBoolean));

		let query = new Parse.Query(Hacker);
		query.get(o.hackerId).then(function(hacker) {
			confirm.set('hacker', hacker);
			return confirm;
		}, function(err) {
			throw new Error(`Error finding the hacker by ID supplied: ${err}`);
		});
	}


}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Confirmation);
