###
# Loads module dependencies and configures app.
###

# Module dependencies
validator = require 'express-validator'		# req validation
autoload = require '../lib/autoload'			# autoloading files
session = require 'express-session'				# handling user sessions
cookieParser = require 'cookie-parser'			# handling cookies
dotenv = require 'dotenv'							# env variable handling
Q = require 'q'										# async handling
moment = require 'moment'							# Date parsing
uuid = require 'node-uuid'							# random string generation
io = require 'socket.io'							# http socket managment
morgan = require 'morgan'							# http logging
Parse = require 'parse/node'						# parse javascript api

util = require 'util'								# nodejs utilites
path = require 'path'								# path

module.exports = (app, http) ->
	# Save module references for later use
	app.moment = moment
	app.Q = Q
	app.uuid = uuid
	app.io = io(http)
	app.util = util
	app.path = path
	
	# Load static application data
	app.data = require __dirname + '/../lib/data'

	# Load helper functions
	app.locals.helpers = require __dirname + '/../app/helpers'

	# Load environment
	dotenv.load()
	app.env = process.env
		
	if !app.env.RUN_LEVEL
		app.env.RUN_LEVEL = 'DEV'

	switch app.env.RUN_LEVEL
		when 'DEV'
			app.locals.pretty = true
			app.use morgan 'dev'
			
		when 'PROD'
			app.locals.pretty = false
				
	
	# Configure express
	app.set 'port', app.env.PORT || 5003
	app.set 'views', __dirname + '/../app/views'
	app.set 'view engine', 'jade'
	app.use require('express').static __dirname + '/../public'
	app.use validator()


	# Configure database - Parse (Kaiseki) object
	app.Parse = Parse
	app.Parse.initialize app.env.PARSE_APP_ID
	, app.env.PARSE_JS_KEY, app.env.PARSE_MASTER_KEY
	app.Parse.Cloud.useMasterKey()


	# Autoload controllers & models
	app.controllers = {}
	app.models = {}
	autoload 'app/controllers', app
	autoload 'app/models', app

	# Session settings
	app.use session
		name: 'connect.sid'
		secret: app.env.SECRET + ' '
		cookie:
			maxAge: 172800000		# 2 days
		saveUninitialized: false
		resave: false
	app.use (req,res,next) ->
		res.locals.session = req.session;
		next();
		
		
	# Email setup
	app.emailManager = require('../lib/emailManager') app
	
	
	
	hackathon = new app.models.Hackathon
		name: 'test'
	hackathon.save()
	.then (obj)->
		console.log 'saved' 
		console.log obj
	, (err)->
		console.log err
	