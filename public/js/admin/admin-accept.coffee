###

For: /admin/accept

###

$('#accept').click() ->
 
	console.log "App Accepted"

	data = 
		objectId: $('#appId').val()

	$('#accept').txt 'Sending...'
	$.ajax
		type: 'post'
		url: '/admin/accept'
		data: data
		success: (res) ->
			console.log 'Success'
			$('#submit').text 'Sent!'
		error: () ->
			console.log 'Error'

	return

