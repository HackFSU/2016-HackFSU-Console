/**
* User model
*
* Autogenerated by modelify.js.
* TODO: Add your own documentation for this file here.
*/

'use strict';

import Parse from 'parse/node';
import _ from 'lodash';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'User';

export default class User extends Parse.User {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let user = new User();
		o = validate(o, _.isObject);
		user.firstName = validate(o.firstName, firstName => {
			return !!firstName && _.isString(firstName);
		});
		user.lastName = validate(o.lastName, lastName => {
			return !!lastName && _.isString(lastName);
		});
		user.email = validate(o.email, email => {
			return !!email;
		});
		user.password = validate(o.password, password => {
			return !!password && _.isString(password);
		});
		user.diet = validate(o.diet, _.isString);
		user.shirtSize = validate(o.shirtSize, shirtSize => {
			return !!shirtSize && _.isString(shirtSize);
		});
		user.github = validate(o.github, _.isString);
		user.phone = validate(o.phone, _.isString);

		user.set('firstName', user.firstName);
		user.set('lastName', user.lastName);
		user.set('email', user.email);
		user.set('username', user.email);			// This is dumb
		user.set('password', user.password);
		user.set('diet', user.diet);
		user.set('shirtSize', user.shirtSize);
		user.set('github', user.github);
		user.set('phone', user.phone);

		return user;
	}

	/**
	* Returns the User's name, formatted as 'FIRST LAST'
	*/
	getName() {
		return `${this.get('firstName')} ${this.get('lastName')}`;
	}


	static checkLogin(email, password) {
		let query = new Parse.Query(User);
		query.equalTo('username', email);
		query.equalTo('password', password);
		query.select([
			'objectId',
			'roleKey'
		]);

		return new Promise(function(resolve, reject) {
			query.first()
			.then(function(user) {
				resolve({
					objectId: user.get('objectId'),
					roleKey: user.get('roleKey')
				});
			}, function(err) {
				reject(err);
			});
		});
	}


	/**
	 * Simple query automation
	 */
	static loadSimple(objectId, ...cols) {
		let query = new Parse.Query(User);
		query.equalTo('objectId', objectId);
		query.select(cols);

		return new Promise(function(resolve, reject) {
			query.first()
			.then(function(user) {
				let result = {};

				cols.forEach(function(c) {
					result[c] = user.get(c);
				});

				resolve(result);

			}, function(err) {
				reject(err);
			});
		});
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, User);
