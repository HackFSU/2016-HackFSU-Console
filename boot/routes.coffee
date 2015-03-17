###
	Specify all routes here.
	
###
acl = require '../lib/acl'
bodyParser = require 'body-parser'

module.exports = (app) ->
	#Body parsers
	jsonParser = bodyParser.json()
	urlencodedParser = bodyParser.urlencoded {extended: false}
	
	# Enforce ACL
	app.use acl
	
	
	# ADMINISTRATION ###########################################
	
	# Home
	app.get '/admin', app.AdminController.home
	
	# updates
	app.get '/admin/updates', app.AdminController.updates
	app.post '/admin/updates_create', urlencodedParser, app.AdminController.updates_create
	
	# applications
	app.get '/admin/applications', app.AdminController.applications
	app.post '/admin/applications_action', jsonParser, app.AdminController.applications_action
	app.post '/admin/applications_getStatusCounts', jsonParser, app.AdminController.applications_getStatusCounts
	
	# users
	app.get '/admin/users', app.AdminController.users
	
	# emails
	app.get '/admin/emails', app.AdminController.emails
	app.post '/admin/emails_submit', urlencodedParser, app.AdminController.emails_submit
	
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
	app.post '/signin_submit', urlencodedParser, app.PublicController.signin_submit
	
	# Shareables
	app.get '/spreadtheword', app.PublicController.shareables

	# Signup
	app.get '/signup', app.PublicController.signup
	app.post '/signup_submit', urlencodedParser, app.PublicController.signup_submit
	
	# View updates
	#app.get '/updates', app.PublicController.updates

	# Create update
	# app.get '/updates/new', app.UpdatesController.new

	# Add update
	# app.post '/updates/add', urlencodedParser, app.UpdatesController.add

	# Create email
	# app.get '/email', app.EmailController.new

	# Apply to HackFSU
	app.get '/apply', app.PublicController.apply
	app.post '/apply_submit', jsonParser, app.PublicController.apply_submit
	
	# Confirm Attendance page
	app.get '/confirm/:confirmationId', app.PublicController.confirm
	app.post '/confirm_submit', jsonParser, app.PublicController.confirm_submit
	
	# Contact HackFSU
	#app.get '/contact', app.PublicController.contact
	
	# Hackathon Schedule
	app.get '/schedule', app.PublicController.schedule
	
	# Mentor form
	app.get '/mentor', app.PublicController.mentor
	app.get '/mentors', app.PublicController.mentor
	app.post '/mentor_submit', jsonParser, app.PublicController.mentor_submit
	
	# Sponsor page (includes sponsor of the month at the top)
	app.get '/sponsor', app.PublicController.sponsor

	# Schedule page
	# app.get '/schedule', app.PublicController.schedule

	# Maps page - TEMPORARY PAGE
	# app.get '/maps', app.PublicController.maps
	
	# Stats page
	app.get '/stats', app.PublicController.stats
	
	# OTHER ###################################################
	
	# Error page. errorMsg is outputed
	#app.get '/error', app.PublicController.error

	# Page not found (404)
	# This should always be the LAST route specified
	app.get '*', (req, res) ->
		res.render 'public/404', title: 'Error 404'
