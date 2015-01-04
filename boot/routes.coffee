###
	Specify all routes here.
	
###

module.exports = (app) ->
	
	# ADMINISTRATION ###########################################
	# Home
	app.get '/admin', app.AdminController.home
	
	# all users
	# app.get '/admin/allUsers', app.AdminController.allUsers


	# USER #####################################################
	
	# Signout
	app.get '/user/signout', app.UserController.signout
	# app.get '/users/signout', app.UsersController.signout
	
	# Profile
	app.get '/user/signout', app.UserController.profile
	# app.get '/users/profile', app.UsersController.profile
	
	
	# PUBLIC ###################################################
	# Index
	app.get '/', app.PublicController.index
	app.get '/index', app.PublicController.index
	app.get '/home', app.PublicController.index
		
	# Signin
	app.get '/signin', app.PublicController.signin
	# app.get '/signin', app.UsersController.signin
	# app.post '/signin_submit', app.UsersController.signin_submit
	
	# Signup
	app.get '/signup', app.PublicController.signup
	# app.get '/signup', app.UsersController.signup
	# app.post '/signup_submit', app.UsersController.signup_submit
	
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
