###
# App-wide helper functions
#
###

# Returns a string of words indicating how long ago something was
exports.timeAgo = (time) ->
	millis = Date.parse time 
	daysAgo = (Date.now() - millis) / 1000 / 60 / 60 / 24

	if daysAgo >= 1
		ago = if daysAgo >= 2 then 'days ago' else 'day ago'
		return "#{Math.floor(daysAgo)} #{ago}"

	hoursAgo = daysAgo * 24

	if hoursAgo >= 1
		ago = if hoursAgo >= 2 then 'hours ago' else 'hour ago'
		return "#{Math.floor(hoursAgo)} #{ago}"

	minsAgo = hoursAgo * 60

	if minsAgo >= 1
		ago = if minsAgo >= 2 then 'minutes ago' else 'minute ago'
		return "#{Math.floor(minsAgo)} #{ago}"

	secsAgo = minsAgo * 60
	ago = if secsAgo >= 2 then 'seconds ago' else 'second ago'

	return "#{Math.floor(secsAgo)} #{ago}"
	
	
# Returns a message to be outputted describing a Parse error (incomplete list)
exports.getParseError = (error, body) ->
	msg = switch
		when error? then 'Error: Unable to connect to the server.'
		when body.code == 125 then 'Error: Invalid email address.'
		when body.code == 101 then 'Error: Invalid email or password.'
		when body.code == 200 then 'Error: Missing email.' # b/c username = email
		when body.code == 202 then 'Error: Email already in use.' 
		else 'Error ' + body.code + ': ' + body.error 
	
	return msg