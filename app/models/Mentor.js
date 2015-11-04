/**
 * Mentor model
 *
 *
 */
'use strict';

export default function (app) {
    const PARSE_CLASSNAME = 'Mentor';

    const Parse = app.Parse;
    const _ = app._;
    const validate = app.validate;

    class Mentor extends Parse.Object {
        constructor(o) {
            super(PARSE_CLASSNAME);

            o = validate(o, _.isObject);
            this.hackathons = validate(o, _.isArray);
            this.affiliation = validate(o, _.isString);
            this.availability = validate(o, _.isArray);
            this.skills = validate(o, _.isArray);
            this.user = validate();     // How do we validate that this is a pointer to a Parse User?
        }
    }

    app.model.Mentor = Mentor;
    Parse.Object.registerSubclass(PARSE_CLASSNAME, Mentor);
}
