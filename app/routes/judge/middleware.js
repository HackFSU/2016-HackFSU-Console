'use strict';

export function setFakeJudgeBody(req, res, next) {
	req.body.password = 'welcomejudges!';
	req.body.shirtSize = 'm-s';
	req.body.phone = '8675309';

	next();
}
