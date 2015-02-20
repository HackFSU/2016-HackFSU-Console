###
For: /admin/applications

###

#setup tabs
tabHtml = 
	schools: $('#schools').wrap('<p/>').parent().html()
	all: $('#all').wrap('<p/>').parent().html()
$('#schools').unwrap()
$('#all').unwrap().remove()
# $('#tabContainer').append(tabHtml.all)
currTab = 0;
 
$('a[role="tab"][href="#schools"]').click (e) ->
	e.preventDefault()
	console.log 'clicked school'
	
	if currTab != 0
		$('#all').remove()
		$('#tabContainer').append(tabHtml.schools)
		currTab = 0
			
	$(this).tab 'show'
$('a[role="tab"][href="#all"]').click (e) ->
	e.preventDefault()
	console.log 'clicked all'
	
	if currTab != 1
		$('#schools').remove()
		$('#tabContainer').append(tabHtml.all)
		currTab = 1
			
	$(this).tab 'show'