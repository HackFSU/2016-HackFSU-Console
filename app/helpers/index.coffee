###
# App-wide helper functions
#
# Author: Trevor Helms
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