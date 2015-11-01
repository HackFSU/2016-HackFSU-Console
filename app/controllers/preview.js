/**
 * HackFSU Preview pages!
 */
'use strict';

export default function(app) {
	app.controller.Preview = {

		home: function(req, res) {
			res.render('preview/home', {
				title: 'HackFSU \'16\''
			});
		},

        subscribe: function(req, res) {
            let subscriber = new app.model.Subscriber({ email: req.body.email });
            subscriber.save({email: req.body.email }).then(function() {
                res.send({ success: true });
            });
        }

	};
}
