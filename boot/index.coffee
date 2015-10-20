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
console.log "> PARSE_APP_ID=" + app.env.PARSE_APP_ID
console.log "> PARSE_JAVASCRIPT_KEY=" + app.env.PARSE_JS_KEY
console.log "> PARSE_MASTER_KEY=" + app.env.PARSE_MASTER_KEY
console.log "> SECRET=" + app.env.SECRET
console.log '-------------------------------'


# Boot server
http.listen app.get('port'), ->
	console.log 'Listening on port ' + app.get('port')
