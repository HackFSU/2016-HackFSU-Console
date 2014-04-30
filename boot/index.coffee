###
# Main boot script. Loads the other boot scripts and creates the server.
#
# Author: Trevor Helms
###

# Create express app
app = require('express')()

# Configure app
require('./config')(app)

# Set up routes
require('./routes')(app)

# Boot server
app.listen app.get('port'), ->
	console.log 'Listening on port ' + app.get('port')