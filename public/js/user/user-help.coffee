###
For: /user/help
###

FADE_TIME = 100

#initial dataTables
dtSettings_requests =
	order: [[0,'desc']]
	aLengthMenu: [[25, 50, 75, -1], [25, 50, 75, "All"]]
	iDisplayLength: 25
	autoWidth: true
dtSettings_hidden =
	order: [[0,'desc']]
	aLengthMenu: [[25,50,75,-1], [25,50,75,"All"]]
	iDisplayLength: 25
	autoWidth: true

socket = io('/user/help')

####################################################################
#setup tabs
$(document).ready ()->

	#tab number [L0,L1]
	currTab = [0,0]

	#get raw tab data
	tabHtml =
		requests: $('#requests').wrap('<p/>').parent().html()
		hidden: $('#hidden').wrap('<p/>').parent().html()

	#cleanup
	$('#tabContainer1').empty()

	$('#tabContainer0').empty()

	#initials
	$('#tabContainer0').append(tabHtml.requests)

	#setup buttons
	$('button[name="hide"]').click ()->
		console.log "clicked"
		hide $(this),
			($(this).attr 'data-objectId')
		return

	$('#DT-requests').DataTable dtSettings_requests



	# 	$(this).tab 'show'
	refreshTabs = ()->
		$('a[role="tab"]').click (e) ->
			e.preventDefault()

			href = $(this).attr('href')
			# console.log href+ ' TAB CLICKED'


			switch href
				when '#requests'
					if currTab[0] != 0
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.requests)

						#setup buttons
						$('button[name="hide"]').click ()->
							hide $(this),
								($(this).attr 'data-objectId')

							return

						$('#DT-requests').DataTable dtSettings_requests
						currTab[0] = 0

				when '#hidden'
					if currTab[0] != 1
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.hidden)

						$('#DT-hidden').DataTable dtSettings_hidden
						currTab[0] = 1

				else
					console.log 'Invalid tab id'

		$(this).tab 'show'


	refreshTabs()

hide = ($btn, objectId) ->
	$('button[data-objectId="'+objectId+'"]').attr 'disabled', 'disabled'
	$btn.text '...'
	$('#loading img').fadeTo FADE_TIME, 1

	console.log 'Hiding ' + objectId

	$.ajax
		type: 'POST'
		url: '/user/help_hide'
		data: JSON.stringify
			objectId: objectId
		contentType: 'application/json'
		success: (res) ->
			console.log JSON.stringify res, undefined, 2
			if res.success
				$btn.text 'Done!'
				$('#requests').closest('table').closest('tbody').append('<div>test</div>')

				#$('button[data-objectId="'+objectId+'"]').closest('tr').remove()
				socket.emit 'help hide', objectId

			else
				$btn.text 'Error!'
				$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			$('#loading img').fadeTo FADE_TIME, 0
			return
		error: () ->
			$btn.text 'Error!'
			$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			return
