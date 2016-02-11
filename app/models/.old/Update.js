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

	static sendPush(deviceType, title, subtitle) {
		return new Promise(function(resolve, reject) {
			let query = new Parse.Query(Parse.Installation);
			query.equalTo('deviceType', deviceType);
			query.equalTo('channels', 'updates');
			Parse.Push.send({
				where: query,
				data: {
					title: title,
					alert: deviceType === 'ios'? title + (subtitle? '\n' + subtitle : '') : subtitle
				}
			}).then(resolve, reject);
		});
	}


	static new(title, subtitle, sendPush) {
		return new Promise(function(resolve, reject) {
			let update = new Update();

			if(!subtitle) {
				subtitle = '';
			}

			update.set('title', validate(title, _.isString));
			update.set('subtitle', validate(subtitle, _.isString));



			update.save()
			.then(function() {
				if(sendPush) {
					Update.sendPush('ios', title, subtitle)
					.then(Update.sendPush('android', title, subtitle))
					.then(resolve)
					.catch(reject);
					return;
				}
				resolve();
			}, reject);
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
