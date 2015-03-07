###
'/help'

Handles form submission.

Dependencies:
	jQuery

###

$('#helpForm').submit (event) ->
    event.preventDefault()

    # Get the values
    obj =
        name:        $('#name').val()
        location:    $('#location').val()
        description: $('#description').val()

    val = validate obj

    # Remove prev errors
	$('label').removeClass 'hasInputError'
	$('.form-error-msg').text ''


	if val != true
		# Add new errors
		$('label[for="' + val.for + '"]').addClass 'hasInputError'
		$('.form-error-msg').text val.msg
		$('#submit').shakeIt()
	else
		#preform submission
		$('#submit').text 'Submitting...'
		$.ajax
			type: 'post'
			url: '/help_submit'
			data: obj
			success: (res) ->
				if res.success == true
					endInSuccess()
				else
					endInError()
			error: () ->
				endInError()

	return

# Check values for valid input
#checks values for correct input, returns true or an error string
validate = (obj) ->
	if !obj.name.trim() 				    then return	{for: 'name', 	msg: 'Missing name!'}
	else if !obj.location.trim() 			then return {for: 'location', 	msg: 'Missing location!'}
	else if !obj.description.trim() 		then return	{for: 'description', msg: 'Missing description!'}

	#nothing wrong
	return true

# Handle ending
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
		displayEnd("Thanks!", "A mentor should be out shortly to assist you!")

displayEnd = (header, subtext) ->
	$('input').attr('disabled','disabled');
	$('checkbox').attr('disabled','disabled');
	$('select').attr('disabled','disabled');
	$('#helpForm').fadeTo 1000, 0, ()->
		#create message
		$newMsg = $("<div id='endDisplay'><h3>"+header+ "</h3><h4>"+subtext+"</h4>")
		$newMsg.appendTo($('.sponsor-blurb')).fadeIn 1000, ()->
			$("html, body").animate({ scrollTop: 0 }, 500)
		return
