###
# Specify all routes here.
#
# Author: Trevor
###

module.exports = (app) ->
	# Index
	app.get '/', app.StaticPagesController.index

	# All users
	app.get '/users', app.UsersController.all

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

	# Page not found (404)
	# This should always be the LAST route specified
	app.get '*', (req, res) ->
		res.render '404', title: 'Error 404'
