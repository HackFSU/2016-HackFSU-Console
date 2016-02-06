/**
 * Judge class
 * - stores data needed about hackathon judges
 */

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';
import User from 'app/models/User';

const PARSE_CLASSNAME = 'Judge';

export default class Judge extends Parse.Object {
	constructor() {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let judge = new Judge();

		validate(o, _.isPlainObject);

		// setup user relation
		let user = new User();
		user.id = validate(o.userId, _.isString);

		// Judge attributes
		judge.set('waiverSignature', validate(o.waiverSignature, _.isString));
		judge.set('mlhcoc', validate(o.mlhcoc, _.isBoolean));
		judge.set('user', user);
		judge.set('status', 'pending'); // will change when accepted by admin
		// rounds[JudgeRound refs] 

		return judge;
	}

	/**
	 * Gets judge by judgeId
	 * Updates status to 'accepted'
	 * Updates user roleKey with Judge role id
	 */
	static accept(judgeId) {
		return new Promise(function(resolve, reject) {
			// get judge
			let query = new Parse.Query(Judge);
			query.include([
				'user'
			]);
			query.select([
				'user.roleKey',
				'status'
			]);
			query.get(judgeId)
			.then(function(judge) {
				let saveJudgeStatus = new Promise(function(resolve, reject) {
					judge.set('status', 'accepted');
					judge.save().then(resolve, reject);
				});

				let user = User.createInstance(judge.get('user'));
				let updateUserRoleKey = user.addRoleAndSave('Judge');

				Promise.all([
					saveJudgeStatus,
					updateUserRoleKey
				])
				.then(resolve)
				.catch(reject);

			}, reject);
		});
	}

}


 Parse.Object.registerSubclass(PARSE_CLASSNAME, Judge);
