/**
 * Handles judge signup for non-users
 */
'use strict';

import Judge from 'app/models/Judge';

export function validate(req, res, next) {
	req.checkBody('waiverSignature').notEmpty();
	req.checkBody('mlhcoc').isBoolean();

	if(req.validationErrors()) {
		res.json({
			error: req.validationErrors()
		});
		return;
	}

	next();
}

export function save(req, res, next) {
	let userId;

	// Grab the userId from current or stored user (allow admin creation)
	if(req.session && req.session.user && !(res.locals.user && res.locals.acl.canAccess.Admin)) {
		userId = req.session.user.userId;
	} else if(res.locals.user) {
		userId = res.locals.user.objectId;
	}

	Judge.new({
		userId: userId,
		waiverSignature: req.body.waiverSignature,
		mlhcoc: req.body.mlhcoc === 'true'
	})
	.save()
	.then(function(obj) {
		req.log.info(`[judge] New Judge ${obj.id} saved for User ${userId}`);
		next();
	}, function(err) {
		req.log.error('[/judge/userSignup] Unable to save new Judge', err);
		res.status(500);
		res.json({
			error: err
		});
	});
}
