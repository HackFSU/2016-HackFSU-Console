# Loads helpers, libraries, and controllers
module.exports = (app) ->
	# Helpers
	app.helpers = require "#{__dirname}/../app/helpers"

	# Libraries
	app.helpers.autoload "#{__dirname}/../lib", app

	# Controllers
	app.helpers.autoload "#{__dirname}/../app/controllers", app