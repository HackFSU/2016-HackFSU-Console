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
	* Checks to make sure someone hasn't already submitted a confirmation
	*/
	static checkNotConfirmed(id) {
		let promiseNotConfirmed = new Parse.Promise();

		Hacker.find(id).then((hacker) => {
			if (hacker.get('status') === 'confirmed') {
				promiseNotConfirmed.reject({
					message: 'You\'ve already submitted your confirmation.'
				});
			}
			else {
				promiseNotConfirmed.resolve();
			}
		}, (err) => {
			promiseNotConfirmed.reject(err);
		});

		return promiseNotConfirmed;
	}

	/**
	* Save the confirmation data. Needs to set the hacker object first.
	* Idk how to fucking do this properly. This is what I came up with.
	*/
	saveIt() {
		let promiseSave = new Parse.Promise();

		Confirmation.checkNotConfirmed(this.hackerId).then(() => {
			let query = new Parse.Query(Hacker);
			query.get(this.hackerId).then((hacker) => {
				hacker.set('status', 'confirmed');
				return hacker.save();
			})
			.then((hacker) => {
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
		}, (err) => {
			promiseSave.reject(err);
		});

		return promiseSave;
	}

}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Confirmation);
