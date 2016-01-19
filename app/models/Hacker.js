/**
* Hacker model
*
* Creates a Hacker object (which also has an associated User object)
*
* TODO: Move private methods to be actually private!
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';
import User from 'app/models/User';

const PARSE_CLASSNAME = 'Hacker';

export default class Hacker extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let hacker = new Hacker();
		o = validate(o, _.isObject);

		// Validate resume independently because we store in elsewhere before
		// associating it with a Hacker
		hacker.resume = validate(o.resumeBase64, _.isString);

		// These are the attributes that are stored in the user account
		hacker.userData = _.pick(o,
			'email',
			'firstName',
			'lastName',
			'password',
			'shirtSize',
			'github',
			'phone',
			'diet'
		);

		// Hacker attributes
		hacker.set('school', validate(o.school, _.isString));
		hacker.set('year', validate(o.year, _.isString));
		hacker.set('major', validate(o.major, _.isString));
		hacker.set('firstHackathon', validate(o.firstHackathon, _.isBoolean));
		hacker.set('hate', validate(o.hate, _.isString));
		hacker.set('comments', validate(o.comments, _.isString));
		hacker.set('wants', validate(o.wants, function(wants) {
			return _.isArray(wants) || wants === undefined;
		}));
		hacker.set('wantjob', validate(o.wantjob, function(wantjob) {
			return _.isArray(wantjob) || wantjob === undefined;
		}));
		hacker.set('yesno18', validate(o.yesno18, _.isBoolean));
		hacker.set('mlhcoc', validate(o.mlhcoc, _.isBoolean));

		return hacker;
	}

	static find(id) {
		let promiseFind = new Parse.Promise();

		let query = new Parse.Query(Hacker);
		query.include('user');
		query.get(id)
			.then(function(hacker) {
				promiseFind.resolve(hacker);
			},
			function(err) {
				promiseFind.reject(err);
			});

		return promiseFind;
	}

	static findAll() {
		let promiseFindAll = new Parse.Promise();

		let query = new Parse.Query(Hacker);
		query.limit(1000);
		query.include('user');
		query.find().then((results) => {
			promiseFindAll.resolve(results);
		}, function(err) {
			promiseFindAll.reject(err);
		});

		return promiseFindAll;
	}

	/**
	* The main signUp function for saving a Hacker. Use this instead of
	* hacker.save()! This does extra work required to save a hacker, such as
	* saving their resume and creating the associated User account (for future
	* login stuff).
	*
	* Returns: a promise.
	* 	On success, the newly created Parse hacker object.
	*		On error, the error.
	*/
	signUp() {
		// This promise is resolved once a Hacker is successfully signed up
		let promiseSignUp = new Parse.Promise();

		this.saveResume(this.resume).then((resumeFile) => {
			// This is a basic promise that resolves to allow us to chain .then()s
			// together
			let promiseSetResume = new Parse.Promise();

			if (resumeFile !== 0) {
				this.set('resume', resumeFile);
			}

			promiseSetResume.resolve();

			return promiseSetResume;
		},
		// Reject promiseSignUp if there was an error saving the resume file.
		(err) => {
			console.log('There was an error creating the resume file: ', err);
			promiseSignUp.reject(err);
		})
		// Called after setResume promise is resolved
		// Returns a promise with the created user to associated with the Hacker
		.then(() => {
			let promiseUserCreated = new Parse.Promise();
			//console.log('wtd');
			this.createUser().then((user) => {
				console.log(user);
				promiseUserCreated.resolve(user);
			},
			(err) => {
				console.log('Creating a user failed: ', err);
				promiseUserCreated.reject(err);
			});
			return promiseUserCreated;
		},
		(err) => {
			promiseSignUp.reject(err);
		})
		// Finally, we save the Hacker here. We first associate the hacker with a
		// User account, then save the hacker and return a promise.
		.then((user) => {
			this.set('user', user);
			this.save().then((hacker) => {
				// This is the main promise to resolve and exits this model function.
				promiseSignUp.resolve(hacker);
			},
			(err) => {
				console.log(err);
				promiseSignUp.reject(err);
			});

		// Error handler if error propogated in creating a user
		}, (err) => {
				promiseSignUp.reject(err);
		});

		// Return a promise to whhatever called signUp()
		return promiseSignUp;
	}

	/**
	* Create the user associated with the Hacker account
	*/
	createUser() {
		let promiseCreateUser = new Parse.Promise();

		let user = User.new(this.userData);

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

	/**
	* Saves resume into the Parse Cloud
	* On success, returns the created file and returns it in a callback.
	*/
	saveResume(base64) {
		let promiseSaveResume = new Parse.Promise();

		if (base64 === '') {
			console.log(`No resume file specified for ${this.userData.firstName} ${this.userData.lastName}`);
			promiseSaveResume.resolve(0);
			return promiseSaveResume;
		}

		let fileName = `${this.userData.firstName}_${this.userData.lastName}_resume.pdf`;
		let resumeFile = new Parse.File(fileName, { base64: base64 });

		resumeFile.save().then(() => {
			console.log(`Resume "${fileName}" saved`);
			promiseSaveResume.resolve(resumeFile);
		}, (err) => {
			console.log(err);
			promiseSaveResume.reject(err);
		});

		return promiseSaveResume;
	}

	static getSchools() {
		let promiseGetSchools = new Parse.Promise();

		let query = new Parse.Query(Hacker);
		// Can't be certain about how many Hackers we'll have, but 1000 seems like a
		// good top-end limit
		query.limit(1000);
		query.select('school', 'user');
		query.include('user');
		query.find().then(function(schools) {
			promiseGetSchools.resolve(schools);
		},
		function(err) {
			promiseGetSchools.reject(err);
		});

		return promiseGetSchools;
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Hacker);





//////////////////
// Use this to make Jared happy if everything else works
/////////////////

// let isIdArray = function(array) {
// 	let valid = true;
// 	if(!Array.isArray(array)) {
// 		return false;
// 	}
//
// 	array.forEach(function(id) {
// 		if(!_.isNumber(id)) {
// 			valid = false;
// 		}
// 		return valid;
// 	});
//
// 	return valid;
// };
//
// this.set('jobGoals', validate(o.jobGoals, isIdArray));
// this.set('hackerGoals', validate(o.hackerGoals, isIdArray));
