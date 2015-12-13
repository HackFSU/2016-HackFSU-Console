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
			this.resume = validate(o.resume, _.isString);

			// This is the data that is stored in the user account
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

			this.set('school', validate(o.school, _.isString));
			this.set('year', validate(o.year, _.isString));
			this.set('shirtSize', validate(o.shirtSize, _.isString));
			this.set('major', validate(o.major, _.isString));
			this.set('firstHackathon', validate(o.firstHackathon, _.isBoolean));
			this.set('github', validate(o.github, _.isString));
			this.set('phone', validate(o.phone, _.isString));
			this.set('hate', validate(o.hate, _.isString));
			this.set('diet', validate(o.diet, _.isString));
			this.set('comments', validate(o.comments, _.isString));
			this.set('wants', validate(o.wants, _.isArray));
			this.set('wantjob', validate(o.wantjob, _.isArray));
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

				this.set('resume', resumeFile);
				promiseSetResume.resolve();

				return promiseSetResume;
			},
			(err) => {
				throw Error(`Couldn't save resume for ${this.name()}: ${err}`);
			})
			// Called after setResume promise is completed
			.then(() => {
				this.save().then((hacker) => {
					// This is the main promise to resolve and exits this model function.
					promiseSignUp.resolve(hacker);
				},
				(err) => {
					promiseSignUp.reject(err);
				});
			});

			// Return a promise to whhatever called signUp()
			return promiseSignUp;
		}

		/**
		* Create the user associated with the Hacker account
		*/
		createUser(userData) {

		}

		/**
		* Saves resume into the Parse Cloud
		* On success, returns the created file and returns it in a callback.
		*/
		saveResume(base64) {
			let promiseSaveResume = new Parse.Promise();
			let fileName = `${this.get('firstName')}_${this.get('lastName')}_resume.pdf`;
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

		/**
		* Returns the Hacker's name, formatted as 'FIRST LAST'
		*/
		name() {
			return `${this.get('firstName')} ${this.get('lastName')}`;
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
