###
# Main boot script. Loads the other boot scripts and creates the server.
###

# Create express app
app = require('express')()
http = require('http').Server(app)

# Configure app
require('./config')(app, http)

# Set up routes
require('./routes')(app)


# Print Start
console.log 'ENV VARS ->'
console.log '> RUN_LEVEL=' + app.env.RUN_LEVEL
console.log "> PARSE_APP_ID_TEST=" + app.env.PARSE_APP_ID_TEST
console.log "> PARSE_REST_KEY_TEST=" + app.env.PARSE_REST_KEY_TEST
console.log "> PARSE_MASTER_KEY_TEST=" + app.env.PARSE_MASTER_KEY_TEST
console.log "> SECRET=" + app.env.SECRET
console.log '-------------------------------'


# Boot server
http.listen app.get('port'), ->
	console.log 'Listening on port ' + app.get('port')
