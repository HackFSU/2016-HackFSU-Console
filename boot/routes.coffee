###
# Specify all routes here.
#
# Author: Trevor
###

module.exports = (app) ->
	# Index
	app.get '/', app.StaticPagesController.index

	# ADMINISTRATION ###########################################
	# Home
	app.get '/admin', app.AdminController.home
	app.get '/admin/home', app.AdminController.home
	# all users
	app.get '/admin/allUsers', app.AdminController.allUsers


	# USER #####################################################
	# Signin
	app.get '/users/signin', app.UsersController.signin
	app.post '/users/signin_submit', app.UsersController.signin_submit
	# Signup
	app.get '/users/signup', app.UsersController.signup
	app.post '/users/signup_submit', app.UsersController.signup_submit
	# Signout
	app.get '/users/signout', app.UsersController.signout
	# Profile
	app.get '/users/profile', app.UsersController.profile
	

	# All updates
	app.get '/updates', app.UpdatesController.all

	# Create update
	app.get '/updates/new', app.UpdatesController.new

	# Add update
	app.post '/updates/add', app.UpdatesController.add

	# Create email
	app.get '/email', app.EmailController.new

	# Start new registration
	app.get '/register', app.RegisterController.new

	# Submit registration
	app.post '/register/submit', app.RegisterController.submit


	# Error page. errorMsg is outputed
	app.get '/error', app.StaticPagesController.error

	# Page not found (404)
	# This should always be the LAST route specified
	app.get '*', (req, res) ->
		res.render '404', title: 'Error 404'
