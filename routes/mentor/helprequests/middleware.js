/**
* Help Request middlewares
*/

'use strict';

import HelpRequest from 'common/models/HelpRequest';

export function getAllHelpRequests(req, res, next) {
	res.json({
		works: 'true'
	});
}
