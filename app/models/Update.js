/**
* Update model
* TODO
*/

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'Update';

export default class Update extends Parse.Object {
	constructor(o) {
		super(PARSE_CLASSNAME);
	}
}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Update);
