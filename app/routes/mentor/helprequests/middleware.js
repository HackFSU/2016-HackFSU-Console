/**
* Help Request middlewares
*/

'use strict';

import HelpRequest from 'app/models/HelpRequest';


/**
* Returns a list of all help requests and assigns them to a request object
*/
export function getAllHelpRequests(req, res, next) {
	HelpRequest.findAll().then(function(helpReqs) {
		req.helpReqs = helpReqs;
		req.log.info({ helpReqs: helpReqs}, 'Successfully retrieved all Help Requests');
		next();
	}, function(err) {
		res.json(err);
	});
}
