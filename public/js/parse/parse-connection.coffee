###
	Setting up parse connection
	
	Dependancies:
		Parse Javascript API
		JQuery

	Notes
		This must be compiled to .js (alt+shift+c)
###

# NOTE: These are for HackFSU-test
PARSE_APP_ID = 'jeoeVa2Nz3VLmrnWpAknbWKZADXHbmQltPSlU8mX'
PARSE_JAVASCRIPT_KEY = 'JoQ24unwktkQMuMvfOjH5KmZCfGswRDPbEiKa7Vz'

#Email class name = 'PreviewSubscription'

parseInitialized = false
startParse = () ->
	#make sure parse is connected
	if !parseInitialized
		Parse.initialize PARSE_APP_ID, PARSE_JAVASCRIPT_KEY
		parseInitialized = true
	console.log 'Parse is initialized'
	
