import Squel from 'squel';
import db from 'config/db';

export default class Model {

	static findAll(className) {
		let query =
			Squel.select()
				.from(className)
				.toString();

		return new Promise(function(resolve, reject) {
			db.query(query).then(function(data) {
				resolve(data);
			});
		});
	}
}
