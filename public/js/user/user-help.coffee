###
For: /user/help
###

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
						$('#DT-requests').DataTable dtSettings_requests
						currTab[0] = 0

				when '#hidden'
					if currTab[0] != 1
						# console.log 'tab changed to ' + href
						$('#tabContainer0').empty()
						$('#tabContainer0').append(tabHtml.hidden)

## TODO
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

						$('#DT-hidden').DataTable dtSettings_hidden
						currTab[0] = 1

				else
					console.log 'Invalid tab id'

		$(this).tab 'show'

	refreshTabs()
