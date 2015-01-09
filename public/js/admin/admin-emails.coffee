###
	Handles server calls to execute email functions
	
	Dependencies:
		jquery
###


$('button').click (event) ->
	event.preventDefault()
		#call via ajax
		$.ajax(
			type: 'post'
			url: '/admin/emails_submit'
			data: 
				templateName: $this.attr('id')
				buttonNum: $('button[id=' + $this.attr('id') + ']').index($this)
			success: (res) ->
				console.log JSON.stringify res, undefined, 2
				# alert("Application Submitted!")
			error: () ->
				# alert("Error in submit!")
		)

		
	return
	