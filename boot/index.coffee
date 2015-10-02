###
# Main boot script. Loads the other boot scripts and creates the server.
#
###

# Create express app
app = require('express')()
http = require('http').Server(app)

# Configure app
require('./config')(app, http)

# Set up routes
require('./routes')(app)

# Boot server
http.listen app.get('port'), ->
	console.log 'Listening on port ' + app.get('port')
