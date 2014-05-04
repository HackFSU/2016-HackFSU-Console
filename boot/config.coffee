###
# Loads module dependencies and configures app.
#
# Author: Trevor Helms
###

# Parse API Keys
PARSE_APP_ID = '4NDzxeC8KxdZi4Kyok7QfGhtS27GuHfntNh9ZSfL'
PARSE_MASTER_KEY = 'k5K40usqxTLInr0OkDpyanoFO6ChaDkQsZTfCwRu'
PARSE_REST_KEY = 'Yv6wS2RcB2iYqs3Fn7kNpGsjSSquY0Xj50uKQxbFar'

# Module dependencies
Kaiseki = require 'kaiseki'
bodyParser = require 'body-parser'
validator = require 'express-validator'
autoload = require '../lib/autoload'

# Configuration
module.exports = (app) ->
	# Create a Parse (Kaiseki) object
	app.kaiseki = new Kaiseki PARSE_APP_ID, PARSE_REST_KEY
	app.kaiseki.masterKey = PARSE_MASTER_KEY

	# Load helper functions
	app.locals.helpers = require __dirname + '/../app/helpers'

	# Autoload controllers
	autoload 'app/controllers', app

	# Configure app settings
	app.set 'port', process.env.PORT || 5000
	app.set 'views', __dirname + '/../app/views'
	app.set 'view engine', 'jade'
	app.use require('express').static __dirname + '/../public'
	app.use bodyParser()
	app.use validator()
