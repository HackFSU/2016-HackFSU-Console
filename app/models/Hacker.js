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

			// Create User by taking the user-specific attributes
			let userAttrs = _.pick(o, 'firstName', 'lastName', 'email', 'password',
																'diet', 'shirtSize', 'github', 'phone');
			this.user = new app.model.User(userAttrs);

			// Validation for Hacker object attributes
			o = validate(o, _.isObject);
			this.firstHackathon = validate(o.firstHackathon, _.isString);
			this.school = validate(o.school, (school) => {
				return !!school && _.isString(school);
			});
			this.major = validate(o.major, (major) => {
				return !!major && _.isString(major);
			});
			this.devpost = validate(o.devpost, (devpost) => {
				return !!devpost && _.isString(devpost);
			});
			this.year = validate(o.year, (year) => {
				return !!year && _.isString(year);
			});
			this.resume = validate(o.resume, _.isString);
			this.hate = validate(o.hate, _.isString);
			this.wants = validate(o.wants, _.isArray);

			// Create and upload resume file
			let resumeFile = new Parse.File(`${this.user.firstName}_${this.user.lastName}_resume.pdf`, { base64: this.resume });
			resumeFile.save().then(() => {
				console.log(`Resume has been saved for ${this.user.firstName} ${this.user.lastName}`);
				this.set('resume', resumeFile);
			}, (err) => {
				console.log(err);
				throw new Error('Cannot continue without resume file.');
			});
		}

		signUp() {
			let promise = new Parse.Promise();
			this.user.signUp().then(
				(user) => {
					console.log(`Testing *** ${user.firstName}`);
					// Create hacker
					this.set('firstHackathon', this.firstHackathon);
					this.set('school', this.school);
					this.set('major', this.major);
					this.set('devpost', this.devpost);
					this.set('year', this.year);
					this.set('status', 'registered');
					this.set('user', user);
					this.save().then(
						(hacker) => {
							promise.resolve(hacker);
						}
					);
				},
				(error) => {
					console.log(`A fucking ERROR bro: ${app.util.inspect(error)}`);
					promise.reject('No');
				}
			);
			return promise;
		}

	}

	app.model.Hacker = Hacker;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Hacker);
}
