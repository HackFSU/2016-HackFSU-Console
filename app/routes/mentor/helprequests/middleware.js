/**
* Help Request middlewares
*/

'use strict';

import HelpRequest from 'app/models/HelpRequest';

export function getAllHelpRequests(req, res, next) {
	HelpRequest.findAll().then(function(helpReqs) {
		req.helpReqs = helpReqs;
		req.log.info({ helpReqs: helpReqs}, 'Successfully retrieved all Help Requests');
		next();
	}, function(err) {
		res.json(err);
	});
}
