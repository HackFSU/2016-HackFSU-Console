###

For: /admin/accept_application

###

$('#acceptForm').submit (event) ->
	event.preventDefault()

	console.log "App Accepted"

	data = {}

	$.ajax
		type: 'post'
		url: '/accept_application'
		data: data
		success: (res) ->
			console.log 'Success'
		error: () ->
			console.log 'Error'

	return

