/**
 * ScheduleItem model
 *
 *
 */
'use strict';

export default function (app) {
    const PARSE_CLASSNAME = 'ScheduleItem';

    const Parse = app.Parse;
    const _ = app._;
    const validate = app.validate;
    const moment = app.moment;

    class ScheduleItem extends Parse.Object {
        constructor(o) {
            super(PARSE_CLASSNAME);

            o = validate(o, _.isObject);
            this.startTime = validate(o.startTime, _.isDate);
            this.endTime = validate(o.endTime, function(time) {
                return _.isDate(time) && moment(time).isAfter(this.startTime);
            });
            this.title = validate(o.title, _.isString);
            this.subtitle = validate(o.subtitle, _.isString);
        }
    }

    app.model.ScheduleItem = ScheduleItem;
    Parse.Object.registerSubclass(PARSE_CLASSNAME, ScheduleItem);
}
