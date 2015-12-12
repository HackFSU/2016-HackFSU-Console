/**
 * AnonStat model
 * 
 * Anonymous statistics collected from hackers. Parse only stores the integer
 * ids for each entry and not the names themselves. Names are in the store.
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
			validate(o.statId, _.isNumber);
			validate(o.optionId, _.isNumber);
			validate(o, function(o) {
				return store.anonStats.hasOwnProperty(o.statId) &&
					store.anonStats[o.statId].options.hasOwnProperty[o.optionId];
			});

			this.set('statId', o.statId);
			this.set('optionId', o.optionId);
		}

	}

	app.model.AnonStat = AnonStat;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, AnonStat);
}
