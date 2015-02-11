###
'/mentor'

Handles form submission.

Dependencies:
	jQuery

###

$('#mentorForm').submit (event)->
	event.preventDefault()
	
	#get values
	obj = 
		firstName:		$('#firstName').val()
		lastName:		$('#lastName').val()
		email:			$('#email').val()
		affiliation:	$('#affiliation').val()
		skills:			$('#skills').val()
		phoneNumber:	$('#phoneNumber').val()
		times: [
			$('#sat-midnight-morning').is ':checked'
			$('#sat-morning-midday').is ':checked'
			$('#sat-midday-evening').is ':checked'
			$('#sat-evening-midnight').is ':checked'
			$('#sun-midnight-morning').is ':checked'
		]

	#validate input
	val = validate obj
	
	#remove prev errors
	$('label').removeClass 'hasInputError'
	$('.form-error-msg').text ''
	
	
	if val != true
		#add new errors
		$('label[for="' + val.for + '"]').addClass 'hasInputError'
		$('.form-error-msg').text val.msg
		$('#submit').shakeIt()
	else
		console.log JSON.stringify obj, undefined, 2
		#preform submission
		$('#submit').text 'Submitting...'
		$.ajax
			type: 'post'
			url: '/mentor_submit'
			data: obj
			success: (res) ->
				if res.success == true
					endInSuccess()
				else
					endInFailure()
			error: () ->
				endInFailure()
	
	return

#checks values for correct input, returns true or an error string
validate = (obj) ->
	#regex validation email/phone
	regE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	regP = /\d/g # only take in the digits

	pn = obj.phoneNumber.match(regP)
	
	if !obj.firstName.trim() 				then return	{for: 'firstName', 	msg: 'Missing first name!'}
	else if !obj.lastName.trim() 			then return {for: 'lastName', 	msg: 'Missing last name!'}
	else if !obj.email.trim() 				then return	{for: 'email', 		msg: 'Missing email!'}
	else if !regE.test(obj.email)			then return	{for: 'email',			msg: 'Valid email required!'}
	else if !obj.phoneNumber.trim() 		then return {for: 'phoneNumber', msg: 'Missing phone number!'}
	else if !pn?								then return {for: 'phoneNumber', msg: 'Full 10-digit phone number required!'}
	else if pn.length != 10 				then return {for: 'phoneNumber', msg: 'Full 10-digit phone number required!'}
	else if !obj.affiliation.trim() 		then return {for: 'affiliation', msg: 'Missing affiliation!'}
	else if !obj.skills.trim() 			then return {for: 'skills', 		msg: 'Missing skills!'}
	else if !obj.times[0] && !obj.times[1] && !obj.times[2] && !obj.times[3] &&  !obj.times[4]
		return 													{for: 'times', 		msg: 'At least one available time is required.'}
	
	#turn phone number int a number strint
	obj.phoneNumber = ""
	for i in pn
		obj.phoneNumber += i
	obj.phoneNumber = parseInt obj.phoneNumber
		
	#nothing wrong
	return true
	
#Handle ending
endInError = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Error!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting.")	
	
endInSuccess = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Success!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		displayEnd("Thanks for mentoring!", "You should be receiving a confirmation email soon.")
	
displayEnd = (header, subtext) ->
	$('input').attr('disabled','disabled');
	$('checkbox').attr('disabled','disabled');
	$('select').attr('disabled','disabled');
	$('#mentorForm').fadeTo 1000, 0, ()->
		#create message
		$newMsg = $("<div id='endDisplay'><h3>"+header+ "</h3><h4>"+subtext+"</h4>")
		$newMsg.appendTo($('.sponsor-blurb')).fadeIn 1000, ()->
			$("html, body").animate({ scrollTop: 0 }, 500)
		return