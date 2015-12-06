/**
 * For user specific functionality
 */
'use strict';

export default function(app) {
	app.controller.User = {

		login: function(req, res) {
			if(!req.session.user) {
				console.log('Logging in user');
				// testing as user obj
				req.session.user = {
					roleId: app.acl.getRoleId('User')
				};
			} else {
				console.log('User already logged in with roleId ' + req.session.user.roleId);
			}

			

			res.render('user/login', {
				title: 'Login'
			});
		},

		profile: function(req, res) {
			//TODO
			res.render('user/profile', {
				title: 'Profile'
			});
		}


	};
}