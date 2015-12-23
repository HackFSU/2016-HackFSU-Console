/**
 * Hackathon Model
 * 
 * Governing Hackathon objects. Allows for control over the current 
 * hackathon instance and the ability to move onto new ones.
 *
 * WARNING:
 *  - Not all data is hackathon-specific, and will be reset upon switching
 *  - Do not create the next hackathon unless you know what you are doing
 *  - current == latest, and requires a server reboot to change
 */
'use strict';

export default function(app) {
	const PARSE_CLASSNAME = 'Hackathon';
	
	// refs to app modules
	const Parse = app.Parse;
	const _ = app._;
	const validate = app.validate;
	const moment = app.moment;

	class Hackathon extends Parse.Object {
		constructor(o) {
			super(PARSE_CLASSNAME);

			o = validate(o, _.isObject);
			this.startDate = validate(o.startDate, _.isDate);
			this.endDate = validate(o.startDate, function(d) {
				return _.isDate(d) && moment(d).isAfter(this.startDate);
			}, true);

			if(!this.endDate) {
				this.endDate = new Date(this.startDate);
				this.endDate.setUTCDate(this.endDate.getUTCDate + 2);
			}
		}
	}

	// export class
	app.model.Hackathon = Hackathon;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Hackathon);
}