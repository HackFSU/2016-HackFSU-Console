###
For /admin/updates

###

#setup dataTables
dtSettings =
	order: [[2,'desc']]
	aLengthMenu: [[10, 20, 30, -1], [10, 20, 30, "All"]]
	iDisplayLength: -1
	autoWidth: true
	
$(document).ready ()->
	$('#DT').DataTable dtSettings
	
#handle form
$('#newUpdateFrom').submit (event)->
	event.preventDefault()
	
	#get values
	obj = 
		title:		$('#title').val()
		subtitle:	$('#subtitle').val()
		sendPush:	$('#sendPush').is ':checked'
		
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
		# console.log JSON.stringify obj, undefined, 2
		
		#prompt for confirmation
		prompt = 'Are you sure you want to create this update?\n\n'+
					obj.title+'\n\n'+obj.subtitle+'\n\n'+'Push='+obj.sendPush
		if confirm prompt
			#preform submission
			$('#submit').text 'Submitting...'
			$.ajax
				type: 'post'
				url: '/admin/updates_create'
				data: obj
				success: (res) ->
					if res.success == true
						endInSuccess()
					else
						endInError()
				error: (res) ->
					if res.msg?
						console.log 'ERROR: ' + res.msg
					endInError()
	
	return

#checks values for correct input, returns true or an error string
validate = (obj) ->
	if !obj.title.trim() 			then return	{for: 'title', 	msg: 'Missing title!'}
	else if !obj.subtitle.trim() 	then return {for: 'subtitle', msg: 'Missing subtitle!'}

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
		displayEnd("Update created!", "Refresh this page to see it in the table below.")
	
displayEnd = (header, subtext) ->
	$('input').attr('disabled','disabled');
	$('checkbox').attr('disabled','disabled');
	$('select').attr('disabled','disabled');
	$('#newUpdateFrom').fadeTo 1000, 0, ()->
		#create message
		$newMsg = $("<div id='endDisplay'><h3>"+header+ "</h3><h4>"+subtext+"</h4>")
		$newMsg.prependTo($('.form-container')).fadeIn 1000, ()->
			$("html, body").animate({ scrollTop: 0 }, 500)
		return
