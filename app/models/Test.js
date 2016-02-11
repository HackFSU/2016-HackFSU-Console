import db from 'config/db';
import Squel from 'squel';
import log from 'config/log';

export default class Test {
	constructor(attrs) {
		this._username = attrs.username;
	}

	static findAll() {
		const query =
			Squel.select()
				.from('Test')
				.toString();

		db.query(query).then(function(data) {
			log.info({ data: data }, 'Query Data');
		});
	}

	save() {

	}
}
