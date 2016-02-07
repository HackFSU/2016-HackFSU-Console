/**
 * Handles judge signup for non-users
 */
'use strict';

import Judge from 'app/models/Judge';

export function save(req, res, next) {
	let userId;

	// Grab the userId from current or stored user (allow admin creation)
	if (req.session && req.session.user && !(res.locals.user && res.locals.acl.canAccess.Admin)) {
		userId = req.session.user.userId;
	}
	else if (res.locals.user) {
		userId = res.locals.user.objectId;
	}

	Judge.new({
		userId: userId
	})
	.save()
	.then(function(obj) {
		Judge.accept(obj.id).then(function() {
			req.log.info({ judge: obj }, `New Judge saved`);
			next();
		});
	}, function(err) {
		req.log.error({ err: err }, 'Unable to save new Judge');
		res.status(500);
		res.json({
			error: err
		});
	});
}
