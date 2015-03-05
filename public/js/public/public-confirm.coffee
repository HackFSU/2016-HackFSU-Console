###
For application confirmation page /confirm/:cid


###


# Handle disabled overlay
# .overlay-img
# .overlay-container
FADE_TIME = 100
jQuery.fn.overlayFit = ()->
	# console.log 'overlay on'
	$(this).find('.overlay-img').css
		height: $(this).height()
		width: $(this).width()
		top: $(this).offset().top
		left: $(this).offset().left;

jQuery.fn.overlayOn = ()->
	$(this).overlayFit()
	$(this).find('.overlay-img').fadeTo(FADE_TIME,.75)
	$(this).find('.overlay-img').css
		'z-index': 100
jQuery.fn.overlayOff = ()->
	$(this).find('.overlay-img').fadeTo(FADE_TIME,0)
	$(this).find('.overlay-img').css
		'z-index': -100
$(window).resize ()->
	$('.overlay-container').overlayFit()

$('#going-y').change ()->
	if $(this).is(':checked')
		$('.overlay-container').overlayOff()

$('#going-n').change ()->
	if $(this).is(':checked')
		$('.overlay-container').overlayOn()


# Form handling
formData = null
$('#confirmForm').submit (event) ->
	event.preventDefault()
	
	# get data
	formData =
		confirmationId: 	$('#confirmationId').val()
		going: 				$('input[type=radio][name=going]:checked').val()
		phoneNumber: 		$('#phoneNumber').val()
		tshirt: 				$('input[type=radio][name=tshirt]:checked').val()
		specialNeeds: 		$('#specialNeeds').val()
		resume: 				null # do after
		gender: 				$('input[type=radio][name=gender]:checked').val()
		bday: 				$('#bday').val()
		diet: 				$('#diet').val()
		comments: 			$('#comments').val()
		agreement: 			$('input[type=checkbox][name=agreement]').is(':checked')
		under18:				$('input[type=radio][name=under18]:checked').val()
	
	
	# check going && under 18
	if formData.going == 'Yes'
		formData.going = true
	else if formData.going == 'No'
		formData.going = false
	else
		formData.going = null
	
	if formData.under18 == 'Yes'
		formData.under18 = true
	else if formData.under18 == 'No'
		formData.under18 = false
	else
		formData.under18 = null
	
	# check resume
	# if $('#resume').val() != ''
	# 	#grab file
	# 	console.log 'Grabbing resume...'
	# 	formData.resume = new FormData()
	# 	formData.resume.append 'resume', $('#resume').prop('files')
	
	
	# check values for correct input
	console.log 'PRE-CHECK: ' + JSON.stringify formData
	formValid = validateForm(formData)
	console.log 'POST-CHECK: ' + JSON.stringify formData
	
	if(formValid != true) 
		# handle error, dont submit
		$('label[for=' +(formValid.for)+']').addClass('hasInputError')
		$('.form-error-msg').text(formValid.msg)
		if formValid.for == 'year'
			$('select[name='+(formValid.for)+']').change () ->
				$('label[for=' +$(this).attr('name')+']').removeClass('hasInputError')
				$('.form-error-msg').text("")
		else
			$('input[name='+(formValid.for)+']').change () ->
				$('label[for=' +$(this).attr('name')+']').removeClass('hasInputError')
				$('.form-error-msg').text("")
			
		$('#submit').shakeIt()
	else
		$('#submit').text('Submitting...')
		console.log 'rawr'
		#submit via ajax
		$.ajax
			type: 'POST'
			url: '/confirm_submit'
			data: JSON.stringify formData
			contentType: 'application/json'
			success: (res) ->
				console.log JSON.stringify res, undefined, 2
				if res.success
					endInSuccess()
				else
					endInError()
					return
			error: () ->
				endInError()
				return
					
	
	console.log formValid
	
	return
	

endInError = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Error!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting your confirmation.")
	return


endInSuccess = () ->
	sub = $('#submit')
	sub.fadeOut 500, ()->
		sub.text('Success!')
		sub.attr('disabled', 'true')
		sub.fadeIn(500, ()->)
		
		if formData.going
			displayEnd("See you soon!", "If you need a group, go check out our facebook <a class='link-text' href='http://www.facebook.com/groups/622705054530502/'>attendees page</a>!")
		else
			displayEnd("Sorry to hear that you are not going!", "Your spot will be opened up for another hacker.")

	return



displayEnd = (header, subtext) ->
	$('input').attr('disabled','disabled');
	$('checkbox').attr('disabled','disabled');
	$('select').attr('disabled','disabled');
	$('#confirmForm').fadeTo 1000, 0, ()->
		#create message
		$newMsg = $("<div id='endDisplay'><h3>"+header+ "</h3><h4>"+subtext+"</h4>")
		$newMsg.appendTo($('.formResult')).fadeIn 1000, ()->
			$("html, body").animate({ scrollTop: 0 }, 500)
		return
	return

#checks values for correct input, returns true or an error string
validateForm = (obj) ->
	#regex validation phone
	regP = /\d/g # only take in the digits
	regB = '^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d$'
	pn = obj.phoneNumber.match(regP)
	
	#required
	if obj.going == null						then return	{for: 'going', 		msg: 'You must decide if you are going!'}
	else if obj.going
		if !obj.phoneNumber || !obj.phoneNumber.trim() 		then return {for: 'phoneNumber', msg: 'Missing phone number!'}
		else if !pn?							then return {for: 'phoneNumber', msg: 'Full 10-digit phone number required!'}
		else if pn.length != 10 			then return {for: 'phoneNumber', msg: 'Full 10-digit phone number required!'}
		else if !obj.tshirt? 				then return {for: 'tshirt', 		msg: 'You must chose a t-shirt size!'}
		else if !obj.under18?				then return {for: 'under18', 		msg: 'Are you under 18 years old?'}
		else if !obj.agreement				then return {for: 'agreement', 	msg: 'You must read and agree to the MLH Code of Conduct and the Medical Waiver!'}
		
		
		#optional checks
		console.log "BDAY:'" + obj.bday + "'" 
		if obj.bday
			obj.bday = obj.bday.trim()
			bd = obj.bday.match(regB)
			if !bd?								then return {for: 'bday', 	msg: 'Valid birthdate in mm/dd/yyyy format only!'}
		else
			obj.bday = null
		
		if !obj.specialNeeds 	then obj.specialNeeds = null
		if !(obj.gender == 'male' | obj.gender == 'female' | obj.gender == 'other')
			obj.gender = null
		if !obj.diet 				then obj.diet = null
		if !obj.comments 			then obj.comments = null
		
		#turn phone number int a number string
		obj.phoneNumber = ""
		for i in pn
			obj.phoneNumber += i
		obj.phoneNumber = parseInt obj.phoneNumber
		
	#nothing wrong
	return true
	

#hidden info
$('.hidden-container').hover ()->
	$(this).find('.hidden-text').fadeTo(FADE_TIME,.75)
	return
, ()->
	$(this).find('.hidden-text').fadeTo(FADE_TIME,0)
	return