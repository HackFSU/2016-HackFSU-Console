###
	Handles submission of application for /apply

	Dependencies:
		JQuery
	IDs
		-match parse ids except for QAs
		QA[0-5]
###

###
# Invalid input visual feedback 
# 	1. shake submit btn
# 	2. make error red
###

###
# Handle form submission 
###
$('#application').submit (event) ->
	event.preventDefault()
	# get values
	appData =
		firstName: $('#firstName').val()
		lastName: $('#lastName').val()
		email: $('#email').val()
		school: $('#school').val()
		major: $('#major').val()
		year: $('#year').val()
		github: $('#github').val()
		# resume: null #still have to load it
		QAs: [
			$('input[type=radio][name=QA0][value=Yes]').is(':checked')
			$('#QA1').val()
			[ #bools
				$('#ios').is(':checked')
				$('#android').is(':checked')
				$('#web').is(':checked')
				$('#front').is(':checked')
				$('#back').is(':checked')
				$('#shelf').is(':checked')
				$('#micro').is(':checked')
			]
		]
		
	console.log JSON.stringify appData
	
	# check values for correct input
	appValid = checkAppData(appData)
	
	if(appValid != true) 
		# handle error, dont submit
		$('label[for=' +(appValid.for)+']').addClass('hasInputError')
		$('.form-error-msg').text(appValid.msg)
		if appValid.for == 'year'
			$('select[name='+(appValid.for)+']').change () ->
				$('label[for=' +$(this).attr('name')+']').removeClass('hasInputError')
				$('.form-error-msg').text("")
		else
			$('input[name='+(appValid.for)+']').change () ->
				$('label[for=' +$(this).attr('name')+']').removeClass('hasInputError')
				$('.form-error-msg').text("")
			
		$('#submit').shakeIt()
	else
		$('#submit').text('Submitting...')
		
		if appValid == true
			#submit via ajax
			$.ajax
				type: 'post'
				url: '/apply_submit'
				data: appData
				success: (res) ->
					console.log JSON.stringify res, undefined, 2
					if res.appValid == true
						endInSuccess()
					else
						endInFailure()
				error: () ->
					endInFailure()
					
	
	console.log appValid
	
	return
	

endInError = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Error!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting your application.")	
	
endInSuccess = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Success!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		displayEnd("Thanks for applying!", "You should be receiving a confirmation email soon.")
	

displayEnd = (header, subtext) ->
	$('input').attr('disabled','disabled');
	$('checkbox').attr('disabled','disabled');
	$('select').attr('disabled','disabled');
	$('#application').fadeTo 1000, 0, ()->
		#create message
		$newMsg = $("<div id='endDisplay'><h3>"+header+ "</h3><h4>"+subtext+"</h4>")
		$newMsg.appendTo($('.containerHeader')).fadeIn 1000, ()->
			$("html, body").animate({ scrollTop: 0 }, 500)
		return
	

###
# Checks appdata for correct input. Returns true for valid,
# or the form number for the first incorrect input (goes top down from 0)
###
checkAppData = (appData) ->
	#regex email validation
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	
	#check for empties/whitespace in the required sections
	if !appData.firstName.trim() then return {for: "firstName", msg:"Missing first name!"}
	if !appData.lastName.trim() then return {for: "lastName", msg:"Missing last name!"}
	if !appData.school.trim() then return {for: "school", msg:"Missing school!"}
	if !appData.email.trim() then return {for: "email", msg:"Missing email!"}
	if !re.test(appData.email) then return {for: "email", msg:"Valid email required!"}
	if !appData.year then return {for: "year", msg:"Missing year!"}
	if !(appData.QAs[0] || $('input[type=radio][name=QA0][value=No]').is(':checked')) then return {for: "QA0", msg:"Missing question #0!'"}
	
	# no invalids triggered
	return true


# shake = (jq) ->
# 	errField = $(jq)
# 	errField.addClass('shakeText')
# 	errField.one 'webkitAnimationEnd oanimationend msAnimationEnd animationend', (e) ->
# 		errField.removeClass('shakeText')
