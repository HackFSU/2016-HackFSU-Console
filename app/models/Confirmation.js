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
		confirm.set('waiverSignature', validate(o.waiverSignature, _.isString));
		confirm.set('mlhDataSharing', validate(o.mlhDataSharing, _.isBoolean));
		confirm.hackerId = validate(o.hackerId, _.isString);

		return confirm;
	}

	/**
	* Save the confirmation data. Needs to set the hacker object first.
	* Idk how to fucking do this properly. This is what I came up with.
	*/
	saveIt() {
		let promiseSave = new Parse.Promise();

		let query = new Parse.Query(Hacker);
		query.get(this.hackerId).then((hacker) => {
			console.log(hacker);
			this.set('hacker', hacker);
			return this.save();
		})
		.then((confirm) => {
			promiseSave.resolve(confirm);
		}, (err) => {
			promiseSave.reject({
				code: 101,
				message: 'Hacker with supplied ID not found.'
			});
		});

		return promiseSave;
	}

}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Confirmation);
