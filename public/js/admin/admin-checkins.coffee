###
For: /user/help
###

FADE_TIME = 100

#initial dataTables
dtSettings_checkIns =
	order: [[0,'asc']]
	aLengthMenu: [[50, 100, 150, -1], [50, 100, 150, "All"]]
	iDisplayLength: 25
	autoWidth: true

socket = io('/admin/checkins')

####################################################################
#setup tabs
$(document).ready ()->

	#setup buttons
	$('button[name="checkin"]').click ()->
		console.log "Check In Clicked!"
		checkIn $(this),
			($(this).attr 'data-objectId')
		return


	table = $('#DT-checkins').DataTable dtSettings_checkIns

	refreshStatusCounts()
	setInterval ()->
		refreshStatusCounts()
	, REFRESH_SPEED

	socket.on 'checked in', (msg) ->
		console.log 'Checked in: ' + msg
		table.cell('#' + msg, '#status').data('<img src="/img/checkedIn.png"></img>').draw()
		table.cell('#' + msg, '#functions').data('N/A').draw()

	return

#Handle counts
REFRESH_SPEED = 60000
refreshStatusCounts = ()->
	console.log 'Refreshing status counts...'
	$('#loading img').fadeTo FADE_TIME, 1
	$.ajax
		type: 'POST'
		url: '/admin/checkins_getStatusCounts'
		data: JSON.stringify {}
		contentType: 'application/json'
		success: (res) ->
			if res.success
				console.log 'Success counting status counts!'
				$('#total').text 'TOTAL  ' + res.counts.total
				$('#expected').text 'EXPECTED  ' + res.counts.expected
				$('#checkedin').text 'CHECKED IN  ' + res.counts.checkedIn
				$('#noshow').text 'NO SHOW  ' + res.counts.noShow

			else
				console.log 'Error counting status counts!'
				$('#total').text 'TOTAL  ERR'
				$('#expected').text 'EXPECTED  ERR!'
				$('#checkedin').text 'CHECKED IN  ERR!'
				$('#noshow').text 'NO SHOW  ERR!'

			$('#loading img').fadeTo FADE_TIME, 0
			return
		error: () ->
			console.log 'Error retrieving status counts!'
			$('#total').text 'TOTAL  ERR'
			$('#expected').text 'EXPECTED  ERR!'
			$('#checkedin').text 'CHECKED IN  ERR!'
			$('#noshow').text 'NO SHOW  ERR!'
			$('#loading img').fadeTo FADE_TIME, 0
			return

checkIn = ($btn, objectId) ->
	$('button[data-objectId="'+objectId+'"]').attr 'disabled', 'disabled'
	$btn.text '...'
	$('#loading img').fadeTo FADE_TIME, 1

	console.log 'Checking in ' + objectId

	$.ajax
		type: 'POST'
		url: '/admin/checkins_checkin'
		data: JSON.stringify
			objectId: objectId
		contentType: 'application/json'
		success: (res) ->
			console.log JSON.stringify res, undefined, 2
			if res.success
				$btn.text 'Done!'
				refreshStatusCounts()
				socket.emit 'check in', objectId
			else
				$btn.text 'Error!'
				$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			$('#loading img').fadeTo FADE_TIME, 0
			return
		error: () ->
			$btn.text 'Error!'
			$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			return
