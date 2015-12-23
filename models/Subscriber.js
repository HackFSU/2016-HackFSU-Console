/**
 * Subscriber model
 *
 *
 */
'use strict';

export default function (app) {
    const PARSE_CLASSNAME = 'Subscriber';

    const Parse = app.Parse;
    const _ = app._;
    const validate = app.validate;

    class Subscriber extends Parse.Object {
        constructor(o) {
            super(PARSE_CLASSNAME);

            // Validate properties
            o = validate(o, _.isObject);
            this.email = validate(o.email, function(email) {
                return /.+@.+\..+/i.test(email);
            });

            // Set properties
            this.set('email', this.email);
        }
    }

    app.model.Subscriber = Subscriber;
    Parse.Object.registerSubclass(PARSE_CLASSNAME, Subscriber);
}
