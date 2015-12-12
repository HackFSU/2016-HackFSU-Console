/**
 * AnonStat model
 * 
 * Anonymous statistics collected from hackers
 */
'use strict';

export default function (app) {
	const PARSE_CLASSNAME = 'AnonStat';

	const Parse = app.Parse;
	const _ = app._;
	const store = app.store;
	const validate = app.validate;

	class AnonStat extends Parse.Object {
		constructor(o) {
			super(PARSE_CLASSNAME);

			validate(o, _.isObject);

			// Validate options
			validate(o.keyName, function(keyName) {
				return _.isString(keyName) && store.anonStats[keyName];
			});

			let possibleValues = store.anonStats[o.keyName].options;

			validate(o.valueName, function(valueName) {
				return _.isString(valueName) && 
					possibleValues.hasOwnProperty(valueName);
			});

			this.set('key', store.anonStats[o.keyName].id);
			this.set('value', possibleValues[o.valueName]);
		}

	}

	app.model.AnonStat = AnonStat;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, AnonStat);
}
