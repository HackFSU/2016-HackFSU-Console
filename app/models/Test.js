import db from 'config/db';
import Squel from 'squel';

import Model from 'app/models/Model';
import log from 'config/log';

const CLASSNAME = 'Test';

export default class Test extends Model {
	constructor(attrs) {
		super();
		this._username = attrs.username;
	}

	static findAll() {
		return super.findAll(CLASSNAME);
	}
}
