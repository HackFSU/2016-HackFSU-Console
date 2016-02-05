/**
 * WifiCred
 * Available and taken wifi credentials
 */
'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'WifiCred';

export default class WifiCred extends Parse.Object {
	constructor() {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let wifiCred = new WifiCred();

		validate(o, _.isPlainObject);

		// Judge attributes
		wifiCred.set('username', validate(o.username, _.isString));
		wifiCred.set('password', validate(o.password, _.isString));
		wifiCred.set('assigned', false);

		return wifiCred;
	}

	// Returns an unassigned wifiCred
	static getUnassigned() {
		return new Promise(function(resolve, reject) {
			let query = new Parse.Query(WifiCred);
			query.equalTo('assigned', false);
			query.first().then(function(wifiCred) {
				if(!wifiCred) {
					reject('No more unassigned keys');
					return;
				}
				resolve({
					cred: wifiCred,
					username: wifiCred.get('username'),
					password: wifiCred.get('password')
				});
			}, reject);
		});
	}

	// Sets 'assigned' to value and then saves obj
	setAssigned(value) {
		return new Promise((resolve, reject) => {
			this.set('assigned', value);
			this.save().then(resolve, reject);
		});
	}

}


 Parse.Object.registerSubclass(PARSE_CLASSNAME, WifiCred);
