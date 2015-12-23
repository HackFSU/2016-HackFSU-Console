/**
* Hacker model
*
* Creates a Hacker object (which also has an associated User object)
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from '../lib/validate';
import User from './User';

const PARSE_CLASSNAME = 'Mentor';

export default class Mentor extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);

		o = validate(o, _.isObject);

		// These are the attributes that are stored in the user account
		this.userData = _.pick(o,
			'email',
			'firstName',
			'lastName',
			'password',
			'shirtSize',
			'github',
			'phone',
			'diet'
		);

		// Mentor attributes
		this.set('affiliation', validate(o.affiliation, _.isString));
		this.set('firstHackathon', validate(o.firstHackathon, _.isBoolean));
		this.set('skills', validate(o.skills, _.isString));
		this.set('comments', validate(o.comments, _.isString));
		this.set('times', validate(o.times, function(times) {
			return _.isArray(times) || times === undefined;
		}));
		this.set('mlhcoc', validate(o.mlhcoc, _.isBoolean));
	}

	/**
	* The main signUp function for saving a Mentor. Use this instead of
	* mentor.save()! This does extra work required to save a mentor, i.e.,
	* creating the associated User account (for future
	* login stuff).
	*
	* Returns: a promise.
	* 	On success, the newly created Parse mentor object.
	*		On error, the error.
	*/
	signUp() {
		let promiseSignUp = new Parse.Promise();

		this.createUser().then((user) => {
			this.set('user', user);
			this.save().then(function(mentor) {
				console.log('New mentor created: ', mentor);
				promiseSignUp.resolve(mentor);
			},
			function(err) {
				console.log('Error creating new mentor: ', err);
				promiseSignUp.reject(err);
			});
		},
		function(err) {
			console.log('Error creating new mentor: ', err);
			promiseSignUp.reject(err);
		});

		return promiseSignUp;
	}

	/**
	* Create the user associated with the Hacker account
	*/
	createUser() {
		let promiseCreateUser = new Parse.Promise();

		let user = new User(this.userData);

		// Sign up the user and resolve the promise
		user.signUp().then((savedUser) => {
			promiseCreateUser.resolve(savedUser);
		},
		// ... or reject with an error
		(err) => {
			promiseCreateUser.reject(err);
		});

		return promiseCreateUser;
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Mentor);
