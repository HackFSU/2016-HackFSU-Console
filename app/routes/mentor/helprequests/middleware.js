/**
* Help Request middlewares
*/

'use strict';

import HelpRequest from 'app/models/HelpRequest';
import Mentor from 'app/models/Mentor';
import HelpRequestAssignedTo from 'app/models/HelpRequestAssignedTo';
import Parse from 'parse/node';


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


/**
* Returns the current mentor (the one using the page) based on session params.
*/
export function getCurrentMentor(req, res, next) {
	Mentor.findByUser(req.session.user.userId)
	.then(function(mentor) {
		req.log.info({ current_mentor: mentor }, 'Current Mentor');
		req.mentor = mentor;
		next();
	}, function(err) {
		res.status(500);
		res.json({
			error: err
		});
	});
}

/**
* Returns HelpRequest object with id from URI params
*/
export function getHelpRequest(req, res, next) {
	HelpRequest.find(req.params.id).then(function(helpReq) {
		req.helpReq = helpReq;
		req.log.info({ helpReq: helpReq }, `Retrieved HelpRequest with ID #${helpReq.id}`);
		next();
	}, function(err) {
		res.status(500);
		res.json({
			error: err
		});
	});
}


/**
* Returns Mentor object with id (mid) from URI params
*/
export function getMentor(req, res, next) {
	Mentor.find(req.params.mid).then(function(mentor) {
		req.mentor = mentor;
		req.log.info({ mentor: mentor }, `Retrieved Mentor with ID #${mentor.id}`);
		next();
	}, function(err) {
		res.status(500);
		res.json({
			error: err
		});
	});
}


/**
* Creates a new HelpRequestAssignedTo object
*/
export function createHelpRequestAssignedTo(req, res, next) {
	HelpRequestAssignedTo.new(req.helpReq, req.mentor).save()
	.then(function(helpReqAssignedTo) {
		req.helpReqAssignedTo = helpReqAssignedTo;

		req.log.info({
			helpReqAssignedTo: helpReqAssignedTo
		}, `Successfully created relation HelpRequestAssignedTo from HelpRequest` +
	 	  `#${req.helpReq.id} to Mentor #${req.mentor.id}`
		);

		next();
	}, function(err) {
		res.status(500);
		res.json({
			error: err
		});
	});
}
