###
	Submitting the email to parse
	
	Dependancies:
		Parse Javascript API
		JQuery
	IDs
		'previewEmailSubscribe'
	Notes
		This must be compiled to .js (alt+shift+c)
###

# NOTE: These are for HackFSU-test
PARSE_APP_ID = 'jeoeVa2Nz3VLmrnWpAknbWKZADXHbmQltPSlU8mX'
PARSE_JAVASCRIPT_KEY = 'JoQ24unwktkQMuMvfOjH5KmZCfGswRDPbEiKa7Vz'

#Email class name = 'PreviewSubscription'

parseInitialized = false

submitEmail = (email) ->
	#change button to loading gif
	console.log 'Submitting...'
	
	#make sure parse is connected
	if !parseInitialized
		Parse.initialize PARSE_APP_ID, PARSE_JAVASCRIPT_KEY
		parseInitialized = true
	
	#create new object
	PreviewSubscription = Parse.Object.extend 'PreviewSubscription'
	prevSub = new PreviewSubscription()
	prevSub.set 'email', email
	
	#save the object + handle result
	prevSub.save null, 
		success: (gameScore) ->
			# success
			saveSuccess()
			console.log 'Save Successful'
		,	
		failure: (gameScore, error) ->
			# failure
			saveFailure()
			console.log 'Save Failed. Error: ' + error
		
$('#previewEmailSubscribe').submit (event)->
	$email = $('#previewEmailSubscribe input[name=email]').val()
	#regex email validation
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	emailVal = re.test($email)
	console.log($email)
	if emailVal
		isValidEmailInput = true
		$('#submit').text('Saving Email')	
		submitEmail $email
	else 
		shake()
		$('#email').val('')
		$('#email').attr('placeholder', 'Invalid Email');

	event.preventDefault()
	
	
# visual feedback
shake = ->
	errField = $('#previewEmailSubscribe')
	errField.addClass('shakeText')
	errField.one 'webkitAnimationEnd oanimationend msAnimationEnd animationend', (e) ->
		errField.removeClass('shakeText')
		

saveFailure = ->
	errColor = '#BF4040'
	shake()
	$('#email').css('border-color', errColor)
	$('#submit').css('border-color', errColor)
	$('#submit').text('Get Notified')
	$('#email').val('')
	$('#email').attr('placeholder', 'Submitting error. Please refresh.');

saveSuccess = ->
	$('#email').fadeOut(1000, ->
		console.log('faded')
		)
	sub = $('#submit')
	sub.fadeOut(1000, ->
		sub.text('See you soon!')
		sub.attr('disabled', 'true')
		sub.removeClass('video-btn')
		sub.addClass('success-btn')
		sub.fadeIn(1000, ->
			)
		)


##############################################################################
# User Signin (post only right now)
##############################################################################

##############################################################################
# Apply
##############################################################################
