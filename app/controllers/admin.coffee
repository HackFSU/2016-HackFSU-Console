# Admin only pages for management
# 
# User is deeded admin if session.isAdmin == true
# To add admins, change that value to true on Parse.com
# 	TODO: make it so you can do it here


# Returns true if admin
# Otherwise redirects to '/' and returns false
# Needs to be checked before every admin-only page

Kaiseki = require 'kaiseki'

module.exports = (app) ->
	@app = app
	class app.AdminController	
		@home = (req, res) ->
			res.render 'admin/home',
				title: 'Admin - Home'
		
		# Lists all users in a chart
		@allUsers = (req, res) ->
			app.kaiseki.getUsers
				limit: 500,
				count: true
			,
			(err, result, body, success) ->
				checkIns = 0;

				body.results.forEach (user) ->
					checkIns++ if user.checkedin

				res.render 'admin/allUsers',
					title: 'All Users',
					count: body.count,
					checkins: checkIns
					users: body.results
		
		########################################################################
		# Updates Management
		########################################################################
		@updates = (req, res) ->
			#load all current updates
			p = @app.models.Updates.getAll()
			p.then (body)-> #resolve
				
				updates = new Array()
				for update in body
					updates.push
						title: update.title
						subtitle: update.subtitle
						createdAt: @app.moment(update.createdAt).format('M/D/YYYY HH:mm:ss A')
				
				res.render 'admin/updates',
					title: 'Admin - Update Management'
					updates: updates
			, (err)-> #reject
				res.render 'admin/updates',
					title: 'Admin - Update Management'
					updates: new Array()
			
			
		
		@updates_create = (req,res)->
			# TODO - sanitize
			valid = true
			
			obj =
				title: if req.body.title?	then req.body.title	else valid = false
				subtitle: if req.body.subtitle?	then req.body.subtitle	else valid = false
				sendPush: if req.body.sendPush?	then req.body.sendPush == 'true'	else valid = false
			
			if valid
				# Create Update
				update = new app.models.Updates(obj)
				p = update.createNew()
				p.then ()-> #resolve
					# Send Push notification
					console.log 'UPDATE CREATED!: ' + JSON.stringify obj
					if(obj.sendPush)
						app.models.Updates.sendPush obj.title, obj.subtitle
					
					res.send
						success: true
						msg: ""
					
				, (err)-> #reject
					res.send
						success: false
						msg: "Parse error: " + err
				
				
				
			else 
				res.send
					success: false
					msg: "Invalid input"
		
		########################################################################
		# Application Management
		########################################################################
		@applications = (req, res) ->
			#load all application data
			# console.log 'APP:' + JSON.stringify @app, undefined, 2
			p = @app.models.Applications.getAllApps()
			p.then (apps)-> #resolve
				#setup some known names and email (last part), case is ignored
				#Most will be auto-generated, this is for duplicate avoidance
				schools = [
					{
						names: ['FSU', 'Florida State University', 'Florida State']
						emails: ['fsu.edu']
						count: 0
					}
					{
						names: ['GT', 'Georgia Institute of Technology', 'Georgia Tech']
						emails: ['gatech.edu']
						count: 0
					}
					{
						names: ['UM', 'University of Miami']
						emails: ['umiami.edu', 'miami.edu']
						count: 0
					}
					{
						names: ['VT', 'Virginia tech']
						emails: ['vt.edu']
						count: 0
					}
					{
						names: ['Stetson University']
						emails: ['stetson.edu']
						count: 0
					}
					{
						names: ['UCF', 'University of Central Florida']
						emails: ['ucf.edu']
						count: 0
					}
					{
						names: ['UNC', 'University of North Carolina']
						emails: ['unc.edu']
						count: 0
					}
					{
						names: ['UNT', 'University of North Texas']
						emails: ['unt.edu']
						count: 0
					}
					{
						names: ['Duke University']
						emails: ['duke.edu']
						count: 0
					}
				]
				
		
				added = false
				email = ''
				QA2Counts = [0,0,0,0,0,0,0]
				for appl in apps
					appl.school = appl.school.trim()
					# console.log appl.firstName
					added = false
					eparts = appl.email.split('@')
					isEdu = false #will only check against others or save if it is
					foundEmail = false
					
					if eparts.length == 2
						eparts = eparts[1].split('.')
						isEdu = eparts[eparts.length-1] == 'edu'
						# console.log isEdu + ' ' + JSON.stringify eparts
						email = eparts[eparts.length-2] + "." + eparts[eparts.length-1]
						# console.log 'e='+email
					else
						console.log appl.email+" IS INVALID" + JSON.stringify eparts
						email = 'invalidEmail' #should not happen
					
					for school in schools when !added
						#check against known name
						for name in school.names when !added
							if appl.school.toLowerCase() == name.toLowerCase().trim()
								added = true
						
						#check against emails
						if isEdu
							for e in school.emails when !foundEmail
								if email.toLowerCase().trim() == e.toLowerCase().trim()
									foundEmail = true
									if !added #is a new school name
										added = true
										school.names.push appl.school
										
							if added and !foundEmail
								school.emails.push email
						
						if added
							# console.log '+1 TO ' + school.names[0]
							++school.count
							
					if !added
						# console.log 'NEW SCHOOL: ' + appl.school
						#add new school
						schools.push
							names: [appl.school]
							emails: if isEdu then [email] else new Array()
							count: 1
					
					# get counts for Q3
					for i in [0..7]
						if appl.QAs[2][i] == true
							++QA2Counts[i]
				
				# Sort schools (done locally now)
				# schools.sort (a,b)->
				# 	if a.count > b.count
				# 		return -1
				# 	else if a.count < b.count
				# 		return 1
				# 	else
				# 		return 0
				
				# get counts for Q3
				
				
				
				res.render 'admin/applications',
					title: 'Admin - Application Management'
					apps: apps
					schools: schools
					QA2Counts: QA2Counts
			, (err)-> #reject
				res.render 'admin/applications',
					title: 'Admin - Application Management'
					apps: new Array()
					schools: new Array()
					msg: 'Error grabbing app data from Parse. Try Refreshing the page.'
					QA2Counts: [0,0,0,0,0,0,0]
		@accept = (req, res) ->
			p = @app.models.Applications.acceptApplication(req.param 'objectId')
			p.then (app) ->
				

		@users = (req, res) ->
			res.render 'admin/users',
				title: 'Admin - User Management'
		
		########################################################################
		# Email Management
		########################################################################
		@emails = (req, res) ->
			res.render 'admin/emails',
				title: 'Admin - Email Management'
					
		@emails_submit = (req, res) ->
			req.assert 'templateName', 'Missing templateName'
			req.assert 'buttonNum', 'Missing buttonNum'
			
			templateName = req.param 'templateName'
			buttonNum = req.param 'buttonNum'
			
			console.log " "
			console.log "----EMAIL MANAGMENT-----"
			console.log templateName + " " + buttonNum
		
			totalSent = 0
			
			switch templateName
				when 'registrationSubscribe'
					switch buttonNum
						when '0'  #send all emails that have not been sent
							# RETRIEVE EMAIL OBJECTS
							parseClass = 'PreviewSubscription'
							params =
								where: {emailSent: {'ne':true}}
							app.kaiseki.getObject parseClass, params, 
							(err,res,body,success) ->
								if success
									console.log body.length + ' Emails found.'
									for obj in body
										if !obj.emailSent
											++totalSent
											#send email
											app.emailTemplate templateName, 
												to_email: obj.email
												from_email: 'register@hackfsu.com'
												from_name: 'HackFSU'
												subject: 'Registration is open!'
												locals: {}
												
											
											#update object
											app.kaiseki.updateObject parseClass, obj.objectId,
												{emailSent: true},
												(err,res,body,success) ->
													if success
														console.log "Parse object successfully marked as sent"
													else
														console.log "Parse object failed to mark as sent"
											
											console.log totalSent + " Emails sent."
									
								else
									console.log 'No emails found: ' + JSON.stringify body
							
							
						else
							console.log "Invalid Email Button"
				
				when 'spreadTheWord'
					params = 
				 		limit: 2000
					switch buttonNum
						when '0' #send emails to 2014, if not sent
							CLASS_2014_NAME = 'User'
							CLASS_2015_NAME = 'Applications'
							
							#complete list of sent emails
							checkedEmails = []
							hasBeenSent = false

							totalSent = 0;
							e = 
								from_email: 'info@hackfsu.com'
								from_name: 'HackFSU'
								subject: 'Spread the Word!'
							
							kaisekiOld = new Kaiseki app.env.PARSE_APP_ID, 
							app.env.PARSE_REST_KEY
							kaisekiOld.masterKey = app.env.PARSE_MASTER_KEY
							
							params =
								limit: 1000
							
							app.kaiseki.getObjects CLASS_2015_NAME, params,
								(err,res,body,success)->
									if err
										console.log "PARSE: '"+CLASS_2015_NAME+"' Object getAll error!"
									else if !success
										console.log "PARSE: '"+CLASS_2015_NAME+"' Object getAll failure!"
									else
										console.log "PARSE: '"+CLASS_2015_NAME+"' Object getAll success!"
										
										# send if not already done
										for obj in body
											
											
											if !obj.sentEmails?
												obj.sentEmails = 
													spreadTheWord: false
													
											if !obj.sentEmails.spreadTheWord
												#check if sent already
												hasBeenSent = false
												for currEmail in checkedEmails when !hasBeenSent
													if currEmail == obj.email
														hasBeenSent = true
														console.log 'already sent to ' + obj.email
												
												if !hasBeenSent
													#send email
													++totalSent
													
													
													app.emailTemplate templateName, 
														to_email: obj.email
														from_email: e.from_email
														from_name: e.from_name
														subject: e.subject
														locals:
															firstName: obj.firstName
															lastName: obj.lastName
													
												#update object
												obj.sentEmails.spreadTheWord = true
												app.kaiseki.updateObject CLASS_2015_NAME, obj.objectId,
													{sentEmails: obj.sentEmails},
													(err,res,body,success) ->
														if success
															console.log "Parse object successfully marked as sent."
														else
															console.log "Parse object failed to mark as sent: " + JSON.stringify body
											checkedEmails.push obj.email
											
										
										# Now get 2014
										kaisekiOld.getUsers params,
											(err,res,body,success)->
												if err
													console.log "PARSE: '"+CLASS_2014_NAME+"' Object getAll error!"
												else if !success
													console.log "PARSE: '"+CLASS_2014_NAME+"' Object getAll failure!"
												else
													console.log "PARSE: '"+CLASS_2014_NAME+"' Object getAll success!"
													
													# send if not already done
													for obj in body
														
														if !obj.sentEmails?
															obj.sentEmails = 
																spreadTheWord: false

														
														if !obj.sentEmails.spreadTheWord
															
															#check if sent already
															hasBeenSent = false
															for currEmail in checkedEmails when !hasBeenSent
																if currEmail == obj.email
																	hasBeenSent = true
																	console.log 'already sent to ' + obj.email
															
															if !hasBeenSent
																#send email
																++totalSent
																
																app.emailTemplate templateName, 
																	to_email: obj.email
																	from_email: e.from_email
																	from_name: e.from_name
																	subject: e.subject
																	locals:
																		firstName: obj.name
																		lastName: ""
															
															#update object
															obj.sentEmails.spreadTheWord = true
															kaisekiOld.updateUser obj.objectId,
																{sentEmails: obj.sentEmails},
																(err,res,body,success) ->
																	if success
																		console.log "Parse object successfully marked as sent."
																	else
																		console.log "Parse object failed to mark as sent: " + JSON.stringify body
														checkedEmails.push obj.email
														
													console.log totalSent + " Emails sent."
							
						else
							console.log 'Invalid Email Button' 
				else
					console.log "Invlaid email template"
								
			
			res.send
				sentEmails: totalSent
			
			
