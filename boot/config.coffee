###
# Loads module dependencies and configures app.
#
# Author: Trevor Helms
###

# Module dependencies
Kaiseki = require 'kaiseki'
bodyParser = require 'body-parser'
validator = require 'express-validator'
Mandrill = require 'mandrill-api/mandrill'
autoload = require '../lib/autoload'
session = require 'express-session'
cookieParser = require('cookie-parser')
dotenv = require 'dotenv'
acl = require '../lib/acl'
flash = require 'express-flash'

# Configuration
module.exports = (app) ->
	# Create Mandrill object
	app.mandrill = new Mandrill.Mandrill('Dqs5qY4wZParpstZXPf7Xg') 

	# Load helper functions
	app.locals.helpers = require __dirname + '/../app/helpers'

	# Autoload controllers
	autoload 'app/controllers', app
	
	# Load env
	dotenv.load()
	
	# Configure app settings
	env = process.env.NODE_ENV || 'development'
	app.set 'port', process.env.PORT || 5003
	app.set 'views', __dirname + '/../app/views'
	app.set 'view engine', 'jade'
	app.use require('express').static __dirname + '/../public'
	app.use validator()
	app.use bodyParser.json()
	app.use bodyParser.urlencoded {extended: true} 
	
	# Create a Parse (Kaiseki) object
	app.kaiseki = new Kaiseki process.env.PARSE_APP_ID_TEST, 
	process.env.PARSE_REST_KEY_TEST
	app.kaiseki.masterKey = process.env.PARSE_MASTER_KEY_TEST

	# Development settings
	if (env == 'development')
		app.locals.pretty = true
		
	#Session settings
	app.use session 
		name: 'connect.sid'
		secret: process.env.SECRET + ' '
		cookie:
			maxAge: 864000		#10 days
		saveUninitialized: false
		resave: false
	app.use (req,res,next) ->
		res.locals.session = req.session;
		next();
	
	# Handle Flash messages
	app.use cookieParser(process.env.SECRET + ' ')
	app.use flash()
	
	# Enforce ACL (needs to be last)
	app.use acl
	
	
	
	#debug crap
	console.log 'ENV VARS ->'
	console.log ("> PARSE_APP_ID_TEST=" + process.env.PARSE_APP_ID_TEST)
	console.log ("> PARSE_REST_KEY_TEST=" + process.env.PARSE_REST_KEY_TEST)
	console.log ("> PARSE_MASTER_KEY_TEST=" + process.env.PARSE_MASTER_KEY_TEST)
	console.log ("> SECRET=" + process.env.SECRET)
	console.log '-------------------------------'
		
		
			
