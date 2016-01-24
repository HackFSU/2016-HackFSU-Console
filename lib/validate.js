/**
 * Abstract validator & sanitizer. Returns value when valid or undefined when
 * unset && optional. Throws 'Validation Failure' when invalid.
 *
 * Expects validator(value) to return a boolean, where true is valid.
 *
 * This is not to be used for checking user input, but rather for function
 * usage where runtime errors are desired.
 *
 * Example Usage with lodash:
 * validate(myNum, _.isNum);
 * myNum = validate(myNum, _.isNum);
 * myNum = validate(myNum, _.isNum, true) || 0;
 *
 * Do not use this to sanitize optional values with defaults for when the
 * the variable is invalid OR unset. Instead, use the validator directly:
 * if(!_.isNum(myNum)) {
 * 	myNum = 10;
 * }
 *
 *
 * TODO: make this better
 */
'use strict';

import _ from 'lodash';


export default function validate(value, validatior, optional, empty) {
	if(optional && (_.isUndefined(value) || _.isNull(value))) {
		return empty;
	}

	if(!_.isFunction(validatior)) {
		throw new TypeError('Invalid validation function. Got ' + typeof validatior + ':"'+validatior+'"');
	}

	if(!validatior(value)) {
		throw new Error('ValidationError: ' + typeof value  +  ':"' + value + '" fails ' + validatior.name);
	}

	return value;
}
