###
	Specify all routes here.
	
###

module.exports = (app) ->
	
	# ADMINISTRATION ###########################################
	# Home
	app.get '/admin', app.AdminController.home
	
	# updates
	app.get '/admin/updates', app.AdminController.updates
	
	# applications
	app.get '/admin/applications', app.AdminController.applications
	
	# users
	app.get '/admin/users', app.AdminController.users
	
	# emails
	app.get '/admin/emails', app.AdminController.emails
	
	# all users
	# app.get '/admin/allUsers', app.AdminController.allUsers


	# USER #####################################################
	
	# Signout
	app.get '/user/signout', app.UserController.signout
	# app.get '/users/signout', app.UsersController.signout
	
	# Profile
	app.get '/user/profile', app.UserController.profile
	# app.get '/users/profile', app.UsersController.profile
	
	
	# PUBLIC ###################################################
	# Index
	app.get '/', app.PublicController.index
	app.get '/index', app.PublicController.index
	app.get '/home', app.PublicController.index
		
	# Signin
	app.get '/signin', app.PublicController.signin
	app.post '/signin_submit', app.PublicController.signin_submit
	
	# Signup
	app.get '/signup', app.PublicController.signup
	app.post '/signup_submit', app.PublicController.signup_submit
	
	# View updates
	app.get '/updates', app.PublicController.updates
	# app.get '/updates', app.UpdatesController.all

	# Create update
	# app.get '/updates/new', app.UpdatesController.new

	# Add update
	# app.post '/updates/add', app.UpdatesController.add

	# Create email
	# app.get '/email', app.EmailController.new

	# Apply to HackFSU
	app.get '/apply', app.PublicController.apply
	app.post '/apply_submit', app.PublicController.apply_submit
	
	# Submit registration
	# app.post '/register/submit', app.RegisterController.submit
	
	# Contact HackFSU
	app.get '/contact', app.PublicController.contact
	
	# Hackathoon Schedule
	app.get '/schedule', app.PublicController.schedule

	# Error page. errorMsg is outputed
	app.get '/error', app.PublicController.error

	# Page not found (404)
	# This should always be the LAST route specified
	app.get '*', (req, res) ->
		res.render 'public/404', title: 'Error 404'
