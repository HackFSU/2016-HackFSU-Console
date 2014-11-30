# Admin only pages for management
# 
# User is deeded admin if session.isAdmin == true
# To add admins, change that value to true on Parse.com
# 	TODO: make it so you can do it here


# Returns true if admin
# Otherwise redirects to '/' and returns false
# Needs to be checked before every admin-only page
checkForAdmin = (req, res) ->
			if req.session.signin == 1
				if req.session.isAdmin == true
					return true
				else
					console.log "Restricted: " + req.session.email
					res.redirect '/'
			else
				console.log "Not logged in"
				res.redirect '/'
			return false

module.exports = (app) ->
	class app.AdminController
		
		@home = (req, res) ->
			if checkForAdmin req, res
				res.render 'admin/home',
					title: 'Admin Home'
		
		# Lists all users in a chart
		@allUsers = (req, res) ->
			if checkForAdmin req, res
				app.kaiseki.getUsers
					limit: 500,
					count: true
				,
				(err, result, body, success) ->
					checkIns = 0;

					body.results.forEach (user) ->
						checkIns++ if user.checkedin

					res.render 'admin/allUsers',
						title: 'All Users',
						count: body.count,
						checkins: checkIns
						users: body.results

