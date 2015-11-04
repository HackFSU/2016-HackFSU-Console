/**
 * User model
 *
 * User objects
 */
'use strict';

export default function(app) {
  const PARSE_CLASSNAME = 'User';

  const Parse = app.Parse;
	const _ = app._;
	const validate = app.validate;

  class User extends Parse.User {
    constructor(o) {
      super(PARSE_CLASSNAME);

      o = validate(o, _.isObject);
      this.firstName = validate(o.firstName, _.isString);
      this.lastName = validate(o.lastName, _.isString);
      this.email = validate(o.email, function(email) {
        return /.+@.+\..+/i.test(email);
      });
      this.password = validate(o.password, _.isString);
      this.diet = validate(o.diet, _.isArray);
      this.shirtSize = validate(o.shirtSize, _.isString);
      this.github = validate(o.github, _.isString);
      this.phone = validate(o.phone, _.isNumber);
    }
  }

  app.model.User = User;
  Parse.Object.registerSubclass(PARSE_CLASSNAME, User);
}
