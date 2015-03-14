###
# Loads module dependencies and configures app.
#
###

# Module dependencies
Kaiseki = require 'kaiseki'						#parse db access
validator = require 'express-validator'		#req validation
Mandrill = require 'mandrill-api/mandrill'	#email sending
autoload = require '../lib/autoload'			#autoloading files
session = require 'express-session'				#handling user sessions
cookieParser = require 'cookie-parser'			#handling cookies
dotenv = require 'dotenv'							#env variable handling
flash = require 'express-flash'					#flash bar
emailTemplates = require 'email-templates'	#email creation
Q = require 'q'										#async handling
moment = require 'moment'							#Date parsing
uuid = require 'node-uuid'							#random string generation
io = require 'socket.io'

# Configuration
module.exports = (app, http) ->
	# Load helper functions
	app.locals.helpers = require __dirname + '/../app/helpers'
	app.moment = moment


	# Autoload controllers
	autoload 'app/controllers', app

	# Load env
	dotenv.load()
	app.env = process.env

	# Configure app settings
	env = app.env.NODE_ENV || 'development'
	app.set 'port', app.env.PORT || 5003
	app.set 'views', __dirname + '/../app/views'
	app.set 'view engine', 'jade'
	app.use require('express').static __dirname + '/../public'
	app.use validator()

	# Moved to routes setup
	# app.use bodyParser.json()
	# app.use bodyParser.urlencoded {extended: true}

	# Create a Parse (Kaiseki) object
	app.kaiseki = new Kaiseki app.env.PARSE_APP_ID_TEST,
	app.env.PARSE_REST_KEY_TEST
	app.kaiseki.masterKey = app.env.PARSE_MASTER_KEY_TEST

	#setup models (must setup db first)
	app.Q = Q
	app.models = {}
	autoload 'app/models', app

	# Socket.io setup
	app.io = io(http)

	# Development settings
	if (env == 'development')
		app.locals.pretty = true

	#Session settings
	app.use session
		name: 'connect.sid'
		secret: app.env.SECRET + ' '
		cookie:
			maxAge: 172800000		#2 days
		saveUninitialized: false
		resave: false
	app.use (req,res,next) ->
		res.locals.session = req.session;
		next();

	# Handle Flash messages
	app.use cookieParser(app.env.SECRET + ' ')
	app.use flash()

	# Create Mandrill object
	app.mandrill = new Mandrill.Mandrill app.env.MANDRILL_KEY
	# Load email template function
	app.emailTemplates = emailTemplates


	#Utility storage
	app.uuid = uuid

	###
	# Sends email using the email-templates and mandrill libraries
	# @param eName = templateDirName (string)
	# @param eData = relevant sending data (see example)
	###
	app.emailTemplate = (eName,eData) ->
		# EXAMPLE eData
		# eData =
		# 	to_email: 'jrdbnntt@gmail.com'
		# 	from_email: 'register@hackfsu.com'
		# 	from_name: 'HackFSU'
		# 	subject: 'Rad Submission, Man'
		# 	locals:
		# 		firstName: "Jared"
		# 		lastName: "Bennett"
		# 	success: function(to_email) #called after mandrill success
		# 	error: function(to_email) #called after mandrill error

		# if eName && eData.emailTo && eData.locals

		path = require 'path'
		templatesDir = path.resolve(__dirname,'..', 'emails')
		app.emailTemplates templatesDir,  (err, template) ->
			if err
				console.log '> emailTemplates error'
			else
				locals = eData.locals
				Render = (locals) ->
					this.locals = locals
					this.send = (err,html,text) ->
						# console.log " > EMAIL HTML:"
						# console.log html
						# console.log " > EMAIL TEXT:"
						# console.log text

						if !err
							console.log ' > Email-templates - Creation success'
							message =
								html: html
								text: text
								subject: eData.subject
								from_email: eData.from_email
								from_name: eData.from_name
								to: [
									email: eData.to_email
									name: if eData.locals.firstName ||
										eData.locals.lastName then eData.locals.firstName +
										' ' + eData.locals.lastName else eData.to_email
									type: 'to'
								]

							app.mandrill.messages.send 'message': message, 'async': true,
								(result) ->
									console.log ' > Mandrill - Email Sent Success - subject="'+ eData.subject+'" to_email= ' + eData.to_email
									if eData.success
										eData.success(eData.to_email)
								, (e) ->
									console.log ' > Mandrill - Error: ' + e.name + ' - ' + e.message
									if eData.error
										eData.error(eData.to_email)
						else
							console.log ' > Email-templates - Error: ' + err

					this.batch = (batch) ->
						batch this.locals, templatesDir, this.send

					return

				template eName, true, (err, batch) ->
					if this.err
						console.log this.err
					else
						render = new Render(locals)
						render.batch(batch)
					return
		# else
		# 	console.log
		# 	return null
		return






	#debug crap
	console.log 'ENV VARS ->'
	console.log ("> PARSE_APP_ID_TEST=" + app.env.PARSE_APP_ID_TEST)
	console.log ("> PARSE_REST_KEY_TEST=" + app.env.PARSE_REST_KEY_TEST)
	console.log ("> PARSE_MASTER_KEY_TEST=" + app.env.PARSE_MASTER_KEY_TEST)
	console.log ("> SECRET=" + app.env.SECRET)
	console.log '-------------------------------'
