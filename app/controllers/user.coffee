# Handles user sessions, signup, and profiles

module.exports = (app) ->
	class app.UserController
		@signout = (req, res) ->
			# req.flash('success', "You have signed out.")
			req.session.destroy()
			res.redirect '/'
		
		@profile = (req, res) ->
			
			# Get any mentor info
			p = app.models.Mentors.getByEmail req.session.email
			p.then (mentorData)->
				res.render 'user/profile',
					title: 'Profile'
					userData:
						firstName: req.session.firstName
						lastName: req.session.lastName
						email: req.session.email
					mentorData: mentorData
			, ()->
				res.render 'user/profile',
					title: 'Profile'
					userData:
						firstName: req.session.firstName
						lastName: req.session.lastName
						email: req.session.email
					mentorData: null
			
			
			
					

			

