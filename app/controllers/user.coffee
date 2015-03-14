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

		@help = (req, res) ->
			hio = app.io.of '/user/help'
			hio.on 'connection', (socket) ->
				console.log '*** Socket.io Connection for /user/help ***'
				socket.on 'disconnect', () ->
					console.log '--- Socket.io Disconnect for /user/help ---'

				socket.on 'help hide', (msg) ->
					console.log 'Hiding: ' + msg


			hrs = app.models.HelpRequests.getAll()
			hrs.then (helpData) ->
				res.render 'user/help',
					title: 'Help Requests'
					helpData: helpData
			, () ->
				res.render 'user/help',
					title: 'Help Requests'
					helpData: null

		@help_hide = (req, res) ->
			console.log "Hide req submitted"
			hiddenBy = req.session.firstName + " " + req.session.lastName
			p = app.models.HelpRequests.hide(req.body.objectId, hiddenBy)
			p.then () ->
				res.send
					success: true
					msg: ""
			, (err) ->
				res.send
					success: false
					msg: "Error hiding help request"
