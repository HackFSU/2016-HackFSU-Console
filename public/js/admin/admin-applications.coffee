###
For: /admin/applications

###

FADE_TIME = 100


#initial dataTables
dtSettings_schools =
	order: [[2,'desc']]
	aLengthMenu: [[25, 50, 75, -1], [25, 50, 75, "All"]]
	iDisplayLength: 25
	autoWidth: true
dtSettings_all =
	order: [[0,'asc']]
	aLengthMenu: [[50,100,200,300,-1], [50,100,200,300,"All"]]
	iDisplayLength: 50
	autoWidth: true
	order: [[8,'desc']]

dtSettings_bday =
	order: [[1,'desc']]
	aLengthMenu: [[50,100,200,300,-1], [50,100,200,300,"All"]]
	iDisplayLength: 50
	autoWidth: true


#0 = default
dtSettings_QAs = [
	{
		order: [[0,'asc']]
		aLengthMenu: [[50,100,200,300,-1], [50,100,200,300,"All"]]
		iDisplayLength: 50
		autoWidth: true
	}
]
dtSettings_QAs.push(dtSettings_QAs[0])
dtSettings_QAs.push(dtSettings_QAs[0])
dtSettings_QAs.push(dtSettings_QAs[0])
dtSettings_QAs.push(dtSettings_QAs[0])



# $('a[role="tab"][href="#schools"]').click (e) ->
# 	e.preventDefault()
# 	console.log 'clicked school'
	
	
			


####################################################################
#setup tabs
$(document).ready ()->
	#tab number [L0,L1]
	currTab = [0,0]
	
	#get raw tab data
	tabHtml = 
		schools: $('#schools').wrap('<p/>').parent().html()
		all: $('#all').wrap('<p/>').parent().html()
		QAs: [
			undefined
			$('#QA1').wrap('<p/>').parent().html()
			$('#QA2').wrap('<p/>').parent().html()
			$('#QA3').wrap('<p/>').parent().html()
			$('#QA4').wrap('<p/>').parent().html()
		]
		under18: $('#under18').wrap('<p/>').parent().html()
		phoneNumbers: $('#phoneNumbers').wrap('<p/>').parent().html()
		specialNeeds: $('#specialNeeds').wrap('<p/>').parent().html()
		tshirt: $('#tshirt').wrap('<p/>').parent().html()
		gender: $('#gender').wrap('<p/>').parent().html()
		bday: $('#bday').wrap('<p/>').parent().html()
		
	#cleanup
	$('#tabContainer1').empty()

	tabHtml.QAs[0] = $('#QAs').wrap('<p/>').parent().html()
	$('#QAs').unwrap().remove()
	
	$('#tabContainer0').empty()
		
	#initials
	$('#tabContainer0').append(tabHtml.schools)
	$('#DT-schools').DataTable dtSettings_schools
	
	
	
	# 	$(this).tab 'show'
	refreshTabs = ()->
		$('a[role="tab"]').click (e) ->
			e.preventDefault()
			
			href = $(this).attr('href')
			# console.log href+ ' TAB CLICKED'
			
			
			switch href
				when '#schools'
					if currTab[0] != 0
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.schools)
						$('#DT-schools').DataTable dtSettings_schools
						currTab[0] = 0
					
				when '#all'
					if currTab[0] != 1
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.all)
						
						#setup buttons
						$('button[name="accept"]').click ()->
							accept $(this), 
								($(this).attr 'data-objectId'),
								($(this).attr 'data-status')
							return
						$('button[name="waitlist"]').click ()->
							waitlist $(this), 
								($(this).attr 'data-objectId'),
								($(this).attr 'data-status')
							return
							
						$('#DT-all').DataTable dtSettings_all
						currTab[0] = 1
						
						
				when '#QAs'
					if currTab[0] != 2
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.QAs[0])
						
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.QAs[1])
						$('#DT-QA1').DataTable dtSettings_QAs[1]
						
						currTab[0] = 2
						currTab[1] = 0
						refreshTabs()
			
				when '#QA1'
					if currTab[1] != 0
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.QAs[1])
						$('#DT-QA1').DataTable dtSettings_QAs[1]
						currTab[1] = 0
					
				when '#QA2'
					if currTab[1] != 1
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.QAs[2])
						$('#DT-QA2').DataTable dtSettings_QAs[2]
						currTab[1] = 1
					
				when '#QA3'
					if currTab[1] != 2
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.QAs[3])
						$('#DT-QA3').DataTable dtSettings_QAs[2]
						currTab[1] = 2
				
				when '#QA4'
					if currTab[1] != 3
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.QAs[4])
						$('#DT-QA4').DataTable dtSettings_QAs[4]
						currTab[1] = 3
				
				when '#under18'
					if currTab[1] != 4
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.under18)
						$('#DT-under18').DataTable dtSettings_QAs[4]
						currTab[1] = 4
				when '#phoneNumbers'
					if currTab[1] != 5
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.phoneNumbers)
						$('#DT-phoneNumbers').DataTable dtSettings_QAs[4]
						currTab[1] = 5
				when '#specialNeeds'
					if currTab[1] != 6
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.specialNeeds)
						$('#DT-specialNeeds').DataTable dtSettings_QAs[4]
						currTab[1] = 6
				when '#tshirt'
					if currTab[1] != 7
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.tshirt)
						$('#DT-tshirt').DataTable dtSettings_QAs[4]
						currTab[1] = 7
				when '#gender'
					if currTab[1] != 8
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.gender)
						$('#DT-gender').DataTable dtSettings_QAs[4]
						currTab[1] = 8
				when '#bday'
					if currTab[1] != 9
						# console.log 'tab changed to ' + href
						$('#tabContainer1').empty()
						$('#tabContainer1').append(tabHtml.bday)
						$('#DT-bday').DataTable dtSettings_bday
						currTab[1] = 9
				else
					console.log 'Invalid tab id'
					
		$(this).tab 'show'
	
	refreshTabs()
	refreshStatusCounts()
	setInterval ()->
		refreshStatusCounts()
	, REFRESH_SPEED

	
#accept an app
STATUS_PENDING = 'pending'
STATUS_WAITLISTED = 'waitlisted'
STATUS_ACCEPTED = 'accepted'
STATUS_GOING = 'going'
STATUS_NOT_GOING = 'not going'
accept = ($btn, objectId, status)->
	$('button[data-objectId="'+objectId+'"]').attr 'disabled', 'disabled'
	$btn.text '...'
	$('#loading img').fadeTo FADE_TIME, 1
	status = if status == undefined then '' else status
	good = false
	
	if status == STATUS_WAITLISTED
		if confirm 'This app was waitlisted, are you sure you want to accept them?'
			good = true
		else
			$btn.text 'accept'
			$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			$('#loading img').fadeTo FADE_TIME, 0
			return
			
	else if status == STATUS_PENDING
		good = true
	
	if good
		console.log 'Accepting ' + objectId
		
		$.ajax
			type: 'POST'
			url: '/admin/applications_action'
			data: JSON.stringify 
				action: 'accept'
				objectId: objectId
			contentType: 'application/json'
			success: (res) ->
				console.log JSON.stringify res, undefined, 2
				if res.success
					$btn.text 'Done!'
				else
					$btn.text 'Error!'
					$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
				$('#loading img').fadeTo FADE_TIME, 0
				return
			error: () ->
				$btn.text 'Error!'
				$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
				$('#loading img').fadeTo FADE_TIME, 0
				return
		
	else
		console.log 'Error! cannot accept ' + objectId + 'with status ' + status
		$btn.text 'Error!'
		$('#loading img').fadeTo FADE_TIME, 0

#put them on waitlist
waitlist = ($btn, objectId, status)->
	$('button[data-objectId="'+objectId+'"]').attr 'disabled', 'disabled'
	$btn.text '...'
	$('#loading img').fadeTo FADE_TIME, 1
	status = if status == undefined then '' else status
	if status == STATUS_PENDING
		if confirm 'Are you sure you want to waitlist this person?'
			console.log 'Waitlisting ' + objectId
			
			$.ajax
				type: 'POST'
				url: '/admin/applications_action'
				data: JSON.stringify 
					action: 'waitlist'
					objectId: objectId
				contentType: 'application/json'
				success: (res) ->
					console.log JSON.stringify res, undefined, 2
					if res.success
						$btn.text 'Done!'
					else
						$btn.text 'Error!'
						$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
						return
					$('#loading img').fadeTo FADE_TIME, 0
				error: () ->
					$btn.text 'Error!'
					$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
					$('#loading img').fadeTo FADE_TIME, 0
					return
		else 
			$btn.text 'waitlist'
			$('button[data-objectId="'+objectId+'"]').removeAttr 'disabled', 'disabled'
			$('#loading img').fadeTo FADE_TIME, 0
	else
		console.log 'Error! cannot waitlist ' + objectId + 'with status ' + status
		$('#loading img').fadeTo FADE_TIME, 0

#Handle counts
REFRESH_SPEED = 60000
refreshStatusCounts = ()->
	console.log 'Refreshing status counts...'
	$('#loading img').fadeTo FADE_TIME, 1 
	$.ajax
		type: 'POST'
		url: '/admin/applications_getStatusCounts'
		data: JSON.stringify {}
		contentType: 'application/json'
		success: (res) ->
			if res.success
				$('#pending').text 'PENDING  ' + res.counts.pending
				$('#waitlisted').text 'WAITLISTED  ' + res.counts.waitlisted
				$('#accepted').text 'ACCEPTED  ' + res.counts.accepted
				$('#going').text 'GOING  ' + res.counts.going
				$('#notGoing').text 'NOT GOING  ' + res.counts.notGoing
				
			else
				console.log 'Error counting status counts!'
				$('#pending').text 'PENDING  ERR!'
				$('#waitlisted').text 'WAITLISTED  ERR!'
				$('#accepted').text 'ACCEPTED  ERR!'
				$('#going').text 'GOING  ERR!'
				$('#notGoing').text 'NOT GOING ERR!'
				return
			$('#loading img').fadeTo FADE_TIME, 0
		error: () ->
			console.log 'Error retrieving status counts!'
			$('#pending').text 'PENDING  ERR!'
			$('#waitlisted').text 'WAITLISTED  ERR!'
			$('#accepted').text 'ACCEPTED  ERR!'
			$('#going').text 'GOING  ERR!'
			$('#notGoing').text 'NOT  GOING ERR!'
			$('#loading img').fadeTo FADE_TIME, 0
			return
#
