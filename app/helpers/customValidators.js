/**
 * Custom request validatiors for express-validator
 * See https://github.com/ctavan/express-validator
 * and its parent validator https://github.com/chriso/validator.js
 *
 * This has app access, so it can use the app.store.
 */

'use strict';

export default function(app) {

	const _ = app._;
	const validate = app.validate;
	const store = app.store;


	/**
	 * For validating object arrays
	 */
	let stringArrayValidator = function(lookupFunction) {
		validate(lookupFunction, _.isFunction);

		return function(value) {
			let valid = true;

			if(!Array.isArray(value)) {
				return false;
			}

			value.forEach(function(name) {
				if(!_.isString(name) ||
					!lookupFunction(name)) {
					valid = false;
				}

				// Stop when first invalid is found
				return valid; 
			});

			return valid;
		};
	};

	return {
		isArray: function(value) {
			return Array.isArray(value);
		},

		isShirtSize: function(value) {
			return _.isString(value) && 
				app.store.shirtSizes.hasOwnProperty(value);
		},

		// Must be an array of valid id object pairs. Can be empty array
		isAnonStatArray: function(value) {
			let valid = true;

			if(!Array.isArray(value)) {
				return false;
			}

			value.forEach(function(pair) {
				if(!_.isPlainObject(pair) ||
					!_.isNumber(pair.statId) ||
					!_.isNumber(pair.optionId) ||
					!store.util.getAnonStatPair(value.statId, value.optionId)) {
					valid = false;
				}

				// Stop when first invalid is found
				return valid; 
			});

			return valid;
		},


		isHackerGoalArray: stringArrayValidator(store.util.getHackerGoalId),
		isJobGoalArray: stringArrayValidator(store.util.getJobGoalId)
	};

}