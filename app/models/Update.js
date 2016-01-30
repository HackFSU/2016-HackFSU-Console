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

	static sendPush(title, subtitle) {
		return new Promise(function(resolve, reject) {
			Parse.Push({
				data: {
					title: title,
					subtitle: subtitle
				},
				channels: ['updates']
			}).then(resolve, reject);
		});
	}

	static new(title, subtitle, sendPush) {
		return new Promise(function(resolve, reject) {
			let update = new Update();

			update.set('title', validate(title, _.isString));
			update.set('subtitle', validate(subtitle, _.isString));

			if(sendPush) {
				Update.sendPush(title, subtitle)
				.then(resolve)
				.catch(reject);
				return;
			}

			resolve();
		});
	}

	static get(objectId) {
		return new Promise(function(resolve, reject) {
			let query = new Parse.Query(Update);

			query.get(validate(objectId, _.isString))
			.then(resolve, reject);
		});
	}

}


Parse.Object.registerSubclass(PARSE_CLASSNAME, Update);
