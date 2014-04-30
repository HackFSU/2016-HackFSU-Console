# Modules
express = require 'express'
http = require 'http'
bodyParser = require 'body-parser'
validator = require 'express-validator'
Kaiseki = require 'kaiseki'
app = express()

# Autoload
require("#{__dirname}/../config/autoload")(app)

# Configuration
app.kaiseki = kaiseki
app.set 'port', process.env.PORT || 5000
app.set 'view engine', 'jade'
app.use express.static "#{__dirname}/../public"
app.use bodyParser()
app.use validator()

# Routes
require("#{__dirname}/routes")(app)

# Start server
app.listen app.get('port'), ->
	console.log 'Listening on port ' + app.get('port')
