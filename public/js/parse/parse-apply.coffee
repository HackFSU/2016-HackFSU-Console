###
	Handles submission of application for /apply

	Dependencies:
		JQuery
	IDs
		-match parse ids except for QAs
		QA[0-5]
###

# startParse()


# Handle form submission 
$('#application').submit (event) ->
	event.preventDefault()
	# get values
	appData =
		firstName: $('#firstName').val()
		lastName: $('#lastName').val()
		email: $('#email').val()
		school: $('#school').val()
		major: $('#major').val()
		year: $('#year').val()
		github: $('#github').val()
		# resume: null #still have to load it
		QAs: [
			$('input[type=radio][name=QA0][value=Yes]').is(':checked')
			$('#QA1').val()
			$('#QA2').val()
			$('#QA3').val()
			$('#QA4').val()
			$('#QA5').val()
		]
		
	console.log JSON.stringify appData
	
	# check values for correct input
	appValid = checkAppData(appData)
	
	if(appValid != true) 
		# handle error, dont submit
		
	else
		#get resume
		# filecontrol = $('#resume')[0]
		# filename = $('#resume').value
		# try 
		# 	if(filecontrol.files.length > 0)
		# 		file = filecontrol.files[0]
		# 		name = (if appData.firstName then appData.firstName else "NULL") + 
		# 			"-" + (if appData.lastName then appData.lastName else "NULL") + 
		# 			"_resume"
				
		# 		parts = file.name.split('.')
		# 		ext = parts[parts.length - 1].toUpperCase()
		# 		if(ext != 'PDF')
		# 			appValid = 7
		# 			return alert("Résumé must be a .pdf file")
		# 		else if (file.size > 9000000)
		# 			appValid = 7
		# 			return alert("Résumé has a max file size of 10MB")
				
		# 		console.log file
		# 		appData.resume = new Parse.File(name, file)
		# 		# $('#resume').val(appData.resume)
		# 		# console.log appData.resume
		# 		# console.log $('#resume').val()
				
		# catch e
		# 	# dont worry about it resume isnt too important
		# 	appData.resume = undefined
		# 	console.log e
		# 	console.log 'Error: Failed to retrieve resume file'
		# finally
		# 	#nothing
		
		if appValid == true
			#submit via ajax
			$.ajax(
				type: 'post'
				url: '/apply_submit'
				data: appData
				success: (res) ->
					console.log JSON.stringify res, undefined, 2
					alert("Application Submitted!")
				error: () ->
					alert("Error in submit!")
			)
		
		# if appValid == true
		# 	# submit to parse (this REALLY should be done server side, but idgaf)
		# 	Application = Parse.Object.extend 'Applications'
		# 	appParse = new Application()
		# 	appParse.save appData,
		# 		success: (appParse) ->
		# 			console.log "Parse Success!"
		# 		,
		# 		error: (appParse, error) ->
		# 			console.log "Parse Failure!"
		
		
	
	console.log appValid
	
	return
	

###
# Checks appdata for correct input. Returns true for valid,
# or the form number for the first incorrect input (goes top down from 0)
###
checkAppData = (appData) ->
	#regex email validation
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	
	#check for empties/whitespace in the required sections
	if !appData.firstName.trim() then return 0
	if !appData.lastName.trim() then return 1
	if !appData.school.trim() then return 2
	if !(appData.email.trim() && re.test(appData.email)) then return 3
	if !appData.year then return 4
	if !(appData.QAs[0] || $('input[type=radio][name=QA0][value=No]').is(':checked')) then return 8
	
	# no invalids triggered
	return true
