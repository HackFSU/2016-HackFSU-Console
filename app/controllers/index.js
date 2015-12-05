/**
 * For handling basic pages
 */
'use strict';

export default function(app) {
	app.controller.Index = {

		index: function(req, res) {
			res.render('map', {
				title: 'Home'
			});
		}


	};
}