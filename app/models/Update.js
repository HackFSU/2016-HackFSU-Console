/**
 * Update model
 *
 *
 */
'use strict';

export default function (app) {
    const PARSE_CLASSNAME = 'Update';

    const Parse = app.Parse;
    const _ = app._;
    const validate = app.validate;

    class Update extends Parse.Object {
        constructor(o) {
            super(PARSE_CLASSNAME);

            o = validate(o, _.isObject);
            this.title = validate(o.title, _.isString);
            this.subtitle = validate(o.subtitle, _.isString);
        }
    }

    app.model.Update = Update;
    Parse.Object.registerSubclass(PARSE_CLASSNAME, Update);
}
