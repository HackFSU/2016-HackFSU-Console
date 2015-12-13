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

			this.set('firstName', validate(o.firstName, _.isString));
			this.set('lastName', validate(o.lastName, _.isString));
			this.set('email', validate(o.email, _.isString));
			this.set('password', validate(o.password, _.isString));
			this.set('diet', validate(o.diet, _.isString));
			this.set('shirtSize', validate(o.shirtSize, _.isString));
			this.set('github', validate(o.github, _.isString));
			this.set('phone', validate(o.phone, _.isString));
			this.set('comments', validate(o.comments, _.isString));

			this.set('codeOfConduct', validate(o.codeOfConduct, _.isBoolean));
			this.set('yesno18', validate(o.yesno18, _.isBoolean));

			let isIdArray = function(array) {
				let valid = true;
				if(!Array.isArray(array)) {
					return false;
				}

				array.forEach(function(id) {
					if(!_.isNumber(id)) {
						valid = false;
					}
					return valid;
				});

				return valid;
			};

			this.set('jobGoals', validate(o.jobGoals, isIdArray));
			this.set('hackerGoals', validate(o.hackerGoals, isIdArray));
			
		}


		saveResume(base64) {
			let dfd = new Parse.Promise();
			let fileName = `${this.user.firstName}_${this.user.lastName}_resume.pdf`;
			let resumeFile = new Parse.File(fileName, { base64: base64 });
			
			resumeFile.save().then(() => {
				console.log(`Resume "${fileName}" saved`);
				this.set('resume', resumeFile);
				dfd.resolve();
			}, (err) => {
				console.log(err);
				dfd.reject(err);
			});

			return dfd;
		}

	}

	app.model.Hacker = Hacker;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Hacker);
}
