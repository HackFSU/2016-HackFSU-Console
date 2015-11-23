/**
* Registration controller duh
*/

'use strict';

export default function(app) {
	app.controller.Registration = {

		form: (req, res) => {
			res.render('registration/form', {
				title: 'Register'
			});
		}
	};
}
