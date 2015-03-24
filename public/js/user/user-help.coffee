###
For: /user/help
###

FADE_TIME = 100
REFRESH_TIME = 30000

#initial dataTables
dtSettings_requests =
	order: [[3,'desc']]
	aLengthMenu: [[25, 50, 75, -1], [25, 50, 75, "All"]]
	iDisplayLength: 25
	autoWidth: true
dtSettings_hidden =
	order: [[3,'desc']]
	aLengthMenu: [[25,50,75,-1], [25,50,75,"All"]]
	iDisplayLength: 25
	autoWidth: true

socket = io('/user/help')

####################################################################
#setup tabs
$(document).ready ()->

	#tab number [L0,L1]
	currTab = [0,0]

	dtHidden = $('#DT-hidden').DataTable dtSettings_hidden
	dtRequests = $('#DT-requests').DataTable dtSettings_requests

	hiddenBy = ''


	#setup buttons
	$('button[name="hide"]').click ()->
		console.log "clicked"

		hide $(this),
			($(this).attr 'data-objectId')
		return

	socket.on 'request hidden', (msg) ->
		data = dtRequests.row('#' + msg).data()
		data[3] = $('#sessionUser').text()
		dtHidden.row.add(data).draw()
		dtHidden.cell(0, '#hiddenBy').data($('#sessionUser').text()).draw()
		dtRequests.row('#' + msg).remove().draw()

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
						$('#hidden').hide()
						$('#requests').show()

						# #setup buttons
						# $('button[name="hide"]').click ()->
						# 	hide $(this),
						# 		($(this).attr 'data-objectId')
						#
						# 	return

						# $('#DT-requests').DataTable dtSettings_requests
						currTab[0] = 0

				when '#hidden'
					if currTab[0] != 1
						$('#requests').hide()
						$('#hidden').show()

						#$('#DT-hidden').DataTable dtSettings_hidden
						currTab[0] = 1

				else
					console.log 'Invalid tab id'

		$(this).tab 'show'


	refreshTabs()
	setInterval () ->
		location.reload(true)
	, REFRESH_TIME

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
