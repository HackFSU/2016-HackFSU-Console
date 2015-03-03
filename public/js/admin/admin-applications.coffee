###
For: /admin/applications

###
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
				else
					console.log 'Invalid tab id'
					
		$(this).tab 'show'
	
	refreshTabs()