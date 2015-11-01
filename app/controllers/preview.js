/**
 * HackFSU Preview pages!
 */
'use strict';

export default function(app) {
	app.controller.Preview = {

		index: function(req, res) {
			res.render('preview/index', {
				title: 'HackFSU \'16\''
			});
		},

		subscribe: function(req, res) {
			let subscriber = new app.model.Subscriber({
				email: req.body.email
			});
			
			subscriber.save().then(function() {
				res.send({ success: true });
			});
		}

	};
}
