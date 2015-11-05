
export default function (app) {
	const PARSE_CLASSNAME = 'Test2';

	const Parse = app.Parse;
	const _ = app._;
	const validate = app.validate;

	class Test2 extends Parse.Object {
		constructor(o) {
			super(PARSE_CLASSNAME);

			o = validate(o, _.isObject);
			this.t1 = validate(o.t1, _.isString);
			this.t2 = validate(o.t2, _.isObject);
			this.t3 = validate(o.t3, _.isArray);
			this.t4 = validate(o.t4, _.isNumber);

		}
	}

	app.model.Test2 = Test2;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Test2);
}
