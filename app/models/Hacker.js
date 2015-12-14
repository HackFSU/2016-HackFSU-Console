/**
* Hacker model
*
* Creates a Hacker object (which also has an associated User object)
*/

'use strict';

export default function (app) {
	const PARSE_CLASSNAME = 'Hacker';

	const Parse = app.Parse;
	const _ = app._;
	const validate = app.validate;

	class Hacker extends Parse.Object {
		constructor(o) {
			super(PARSE_CLASSNAME);

			o = validate(o, _.isObject);

			console.log(o);

			// Validate resume independently because we store in elsewhere before
			// associating it with a Hacker
			this.resume = validate(o.resumeBase64, _.isString);

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

			// Hacker attributes
			this.set('school', validate(o.school, _.isString));
			this.set('year', validate(o.year, _.isString));
			this.set('major', validate(o.major, _.isString));
			this.set('firstHackathon', validate(o.firstHackathon, _.isBoolean));
			this.set('hate', validate(o.hate, _.isString));
			this.set('comments', validate(o.comments, _.isString));
			this.set('wants', validate(o.wants, function(wants) {
				return _.isArray(wants) || wants === undefined;
			}));
			this.set('wantjob', validate(o.wantjob, function(wantjob) {
				return _.isArray(wantjob) || wantjob === undefined;
			}));
			this.set('yesno18', validate(o.yesno18, _.isBoolean));
			this.set('mlhcoc', validate(o.mlhcoc, _.isBoolean));
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

			let user = new app.model.User(this.userData);

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

	}

	app.model.Hacker = Hacker;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Hacker);
}





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
