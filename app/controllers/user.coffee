# Handles user sessions, signup, and profiles

module.exports = (app) ->
	class app.UserController
		@signout = (req, res) ->
			# req.flash('success', "You have signed out.")
			req.session.destroy()
			res.redirect '/'
		
		@profile = (req, res) ->
			res.render 'user/profile',
				title: 'Profile'
				pageData:
					parseSessionToken: req.session.parseSessionToken
					firstName: req.session.firstName
					lastName: req.session.lastName

			

