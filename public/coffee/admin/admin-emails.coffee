###
	Handles server calls to execute email functions
	
	Dependencies:
		jquery
###


$('button').click (event) ->
	event.preventDefault()
	
	data =
		templateName: $(this).attr('id')
		buttonNum: $('button[id=' + $(this).attr('id') + ']').index $(this)
	
	prompt = 'Are you sure you want to send out "'+data.templateName+'" to people?'
	
	if $(this).disabled
		alert 'This action is disabled, and for a good reason. Stahp.'
	else if confirm prompt
		#call via ajax
		console.log 'Emails sent out to ' + data.templateName
		console.log JSON.stringify data
		$.ajax
			type: 'post'
			url: '/admin/emails_submit'
			data: data
			success: (res) ->
				console.log JSON.stringify res, undefined, 2
				# alert("Application Submitted!")
				if res.sentEmails?
					alert(sentEmails + ' emails sent!')
				else
					alert('Not sure how many emails were sent...')
			error: () ->
				# alert("Error in submit!")
	else
		console.log 'No emails sent to ' + data.templateName
		
	return

