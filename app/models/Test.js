
export default function (app) {
	const PARSE_CLASSNAME = 'Test';

    const Parse = app.Parse;
    const _ = app._;
    const validate = app.validate;

    class Test extends Parse.Object {
        constructor(o) {
            super(PARSE_CLASSNAME);

            o = validate(o, _.isObject);
		this.test = validate(o.test, _.isString);		this.test2 = validate(o.test2, _.isString);		this.test3 = validate(o.test3, _.isNumber);
		}
	}

	app.model.Test = Test;
	Parse.Object.registerSubclass(PARSE_CLASSNAME, Test);
}
