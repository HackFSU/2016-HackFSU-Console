# Admin only pages for management
# 
# User is deeded admin if session.isAdmin == true
# To add admins, change that value to true on Parse.com
# 	TODO: make it so you can do it here


# Returns true if admin
# Otherwise redirects to '/' and returns false
# Needs to be checked before every admin-only page
checkForAdmin = (req, res) ->
			if req.session.signin == 1
				if req.session.isAdmin == true
					return true
				else
					console.log "Restricted: " + req.session.email
					res.redirect '/'
			else
				console.log "Not logged in"
				res.redirect '/'
			return false

module.exports = (app) ->
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
						
		@updates = (req, res) ->
			res.render 'admin/updates',
				title: 'Admin - Update Management'
		
		@applications = (req, res) ->
			
			#load all application data
			p = app.models.Applications.getAllApps(app.kaiseki)
			p.then (apps)-> #resolve
				res.render 'admin/applications',
					title: 'Admin - Application Management'
					apps: apps
					
			, (err)-> #reject
				res.render 'admin/applications',
					title: 'Admin - Application Management'
					apps: new Array()
					msg: 'Error grabbing app data from Parse. Try Refreshing the page.'
					
			
					
		@users = (req, res) ->
			res.render 'admin/users',
				title: 'Admin - User Management'
		
		########################################################################
		# Email Management
		########################################################################
		@emails = (req, res) ->
			if checkForAdmin req, res
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
			
			sentEmails = 0
			
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
											++sentEmails
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
									
									console.log sentEmails + " Emails sent."
									return
									
								else
									console.log 'No emails found: ' + JSON.stringify body
							
							
						else
							console.log "Invalid Email Button"
							
				else
					console.log "Invlaid email template"
								
			
			res.send
				sentEmails: sentEmails
			
			
