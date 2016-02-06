/**
 * Judging round
 */

'use strict';

import _ from 'lodash';
import Parse from 'parse/node';
import validate from 'lib/validate';

const PARSE_CLASSNAME = 'JudgeRound';

export default class JudgeRound extends Parse.Object {
	constructor() {
		super(PARSE_CLASSNAME);
	}

	static new(o) {
		let jround = new JudgeRound();

		validate(o, _.isPlainObject);

		jround.set('hacks', validate(o.hacks, _.isArray)); // Hack refs in round
		jround.set('points', []); // array of Hack refs
		jround.set('status', 'in progress'); // -> 'completed' when finished
		// assignedJudge = <> ref to Judge

		return jround;
	}

}


 Parse.Object.registerSubclass(PARSE_CLASSNAME, JudgeRound);
