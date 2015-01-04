# Handles user sessions, signup, and profiles

module.exports = (app) ->
	class app.UserController
		@signout = (req, res) ->
			res.render 'user/signout',
				title: 'Sign out'
		
		@profile = (req, res) ->
			res.render 'user/profile',
				title: 'Profile'

			

