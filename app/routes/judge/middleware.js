'use strict';

export function setFakeJudgeBody(req, res, next) {
	req.body.password = 'ihearttally!';
	req.body.shirtSize = 'm-s';
	req.body.phone = '8675309';

	res.locals.forceAccepted = true;
	next();
}
