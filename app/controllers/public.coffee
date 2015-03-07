module.exports = (app) ->
	class app.PublicController
		@index = (req, res) ->
			res.render 'index',
				title: 'Home'
				
		@error = (req, res) ->
			if req.body.errorData?
				errorData = req.body.errorMsg
			else
				errorData = 
					msg: "Oops, you have encountered an error!"
			
			res.render 'public/error',
				title: "Error!"
				errorData: errorData
				
		
		@contact = (req, res) ->
			res.render 'public/contact',
				title: 'Contact'
		
		@updates = (req, res) ->
			res.render 'public/updates',
				title: 'Updates'
		
		@schedule = (req, res) ->
			res.render 'public/schedule',
				title: 'Schedule'
				
		@sponsor = (req,res) ->
			res.render 'public/sponsor',
				title: 'Sponsor'
		
		@shareables = (req, res) ->
			res.render 'public/shareables',
				title: 'Shareables'

		@maps = (req, res) ->
			res.render 'public/maps',
				title: 'Maps'
		
		########################################################################
		# Mentor
		########################################################################
		@mentor = (req,res) ->
			res.render 'public/mentor',
				title: 'Mentor'
		
		@mentor_submit = (req,res) ->
			#TODO: server-side validation
			
			#get post data
			obj = 
				firstName: 		if req.body.firstName? 		then req.body.firstName else null
				lastName: 		if req.body.lastName? 		then req.body.lastName else null
				email: 			if req.body.email? 			then req.body.email else null
				affiliation:	if req.body.affiliation? 	then req.body.affiliation else null
				skills:			if req.body.skills?	 		then req.body.skills else null
				phoneNumber:	if req.body.phoneNumber? 	then req.body.phoneNumber else null
				times:			if req.body.times? 			then req.body.times else new Array()
			
			#create parse object
			mentor = new app.models.Mentors(obj)
			mentor.createNew()
			.then (success) ->
				console.log "Mentor Submit success"
				
				#send confirmation email
				app.emailTemplate 'mentorConfirm', 
					to_email: obj.email
					from_email: 'info@hackfsu.com'
					from_name: 'HackFSU'
					subject: 'Inspire the Future'
					locals:
						firstName: obj.firstName
						lastName: obj.lastName
				
				
				# Also create them an account (non-admin)
				# Is only created if email is not taken
				usr = new app.models.User
					firstName: obj.firstName
					lastName: obj.lastName
					email: obj.email
					password: "" + obj.phoneNumber
				usr.createNew()
				
				#return response
				res.send
					success: true,
					msg: ""
					
					
			, (err) ->
				console.log "Mentor Submit failure"
				res.send
					success: false,
					msg: err
				
				return 
		
				
		########################################################################
		# Signin - final submission done via post
		########################################################################
		@signin = (req, res) ->			
			if req.session.signin == 1 			#signed in
				res.redirect('/user/profile');
			else
				if req.session.signin == 2 		#failed/no attempt
					console.log "Login failed!"
					
				req.session.signin = 0
				res.render 'public/signin',
					title: 'Sign In'
					
		@signin_submit = (req,res) ->
			#reset signin flag
			req.session.signin = 2
			
			if req.body.email? and
			req.body.password?
					
				# check parse
				app.kaiseki.loginUser req.body.email, req.body.password,
					(error, response, body, success) ->
						# log the result
						msgs = []
						
						if success
							req.flash('success', 'You have successfully signed in!')
							msgs.push("PARSE - LOGIN SUCCESS!")
							#TODO save parse session info
							req.session.parseSessionToken = body.sessionToken
							req.session.firstName = body.firstName
							req.session.lastName = body.lastName
							req.session.email = body.email
							req.session.isAdmin = body.isAdmin
							req.session.signin = 1
																							
						else
							req.flash('error', app.locals.helpers.getParseError(error,body))
							msgs.push("PARSE - LOGIN FAILURE!")
							req.session.signin = 2
						
						# msgs.push("> error: " + JSON.stringify error)
						# msgs.push("> body: " + JSON.stringify body)
						msgs.push("> USER LOGIN SUCCESSFULL: " + body.firstName + " " + body.lastName + " " + body.email)
						for line in msgs 
							console.log(line)
						
						res.redirect '/signin'
				
			else
				req.flash('error', 'Error: Invalid Input!')
				res.redirect '/signin'
				
				
		########################################################################
		# Signup - final submission done via post
		########################################################################
		@signup = (req, res) ->
			res.render 'public/signup',
				title: 'Sign Up'
		@signup_submit = (req, res) ->
			if req.body.firstName? and
			req.body.lastName? and
			req.body.email? and
			req.body.password? and
			req.body.key? and
			req.body.key == app.env.SIGNUP_KEY

				userInfo = 
					username: req.body.email 		#username is email
					password: req.body.password
					firstName: req.body.firstName
					lastName: req.body.lastName
					email: req.body.email
					isAdmin: false			#manually assign admins later
				
				app.kaiseki.createUser userInfo, 
					(error, response, body, success) ->
						#debug
						msgs = []
						if success
							msgs.push("> USER SIGNUP SUCCESSFULL: " + body.firstName + " " + body.lastName + " " + body.email)
						else
							msgs.push("PARSE - SIGNUP FAILURE!")
							msgs.push("> error: " + JSON.stringify error)

						for line in msgs 
							console.log(line)
							
						if success
							res.redirect '/signin'
						else
							res.redirect '/signup'
							
						
			else
				req.flash('error', 'Error: Invalid Input!')
				res.redirect '/signup'
			
		########################################################################
		# Apply - final submission done via post\
		# Parse Class:
		# Applications
		# 	firstName - String
		# 	lastName - String
		# 	email - String
		# 	school - String (from list?)
		# 	major - String
		# 	year - String (from list?)
		# 	github - String
		# 	QAs - Array of answers to below questions
		# 		[0] Will this be your first hackathon?
		# 			(t/f)
		# 		[1] What is one thing you hate about hackathons?
		# 			(string)
		# 		[2] What do you want to learn or hack on for the weekend?
		# 			(array of strings)
		# 		[3] What are some things you have made that you are proud of?
		# 			(string)
		# 		[4] Food Allergies 
		# 			(array of strings)
		# 		[5] Comments? 
		# 			(array of strings)
		########################################################################
		
		@apply = (req, res) ->
			res.render 'public/apply',
				title: 'Apply'
		@apply_submit = (req,res) ->						
			# validate input (assert + sanitize all)
			req.assert('firstName', 'First Name Requied')
			req.assert('lastName','Last Name Required')
			req.assert('email','Valid Email Requied').isEmail()
			req.assert('school').optional().len(0,100)
			req.assert('major').optional().len(0,100)
			req.assert('year').optional().len(0,100)
			req.assert('github').optional().len(0,100)
			req.assert('QAs','Answer Required')
			
			req.sanitize('firstName').toString()
			req.sanitize('lastName').toString()
			req.sanitize('email').toString()
			req.sanitize('school').toString()
			req.sanitize('major').toString()
			req.sanitize('year').toString()
			req.sanitize('github').toString()
						
			console.log 'Application Recieved'
			
			inputErrors = req.validationErrors(true)
			
			# somehow this was undefined and crashed, this is precaution
			inputErrors = if req.body.QAs != undefined then inputErrors else true
			if !inputErrors
				inputErrors = if req.body.QAs != undefined then inputErrors else true
			
			if(!inputErrors)
				#proceed to submit app
				
				#make sure boolean QA s are boolean
				QAs = req.body.QAs
				QAs[0] = QAs[0] == 'true'
				if QAs[2] #loop wasnt working for some reason idgaf
					QAs[2][0] = if QAs[2][0] then QAs[2][0] == 'true' else false
					QAs[2][1] = if QAs[2][1] then QAs[2][1] == 'true' else false
					QAs[2][2] = if QAs[2][2] then QAs[2][2] == 'true' else false
					QAs[2][3] = if QAs[2][3] then QAs[2][3] == 'true' else false
					QAs[2][4] = if QAs[2][4] then QAs[2][4] == 'true' else false
					QAs[2][5] = if QAs[2][5] then QAs[2][5] == 'true' else false
					QAs[2][6] = if QAs[2][6] then QAs[2][6] == 'true' else false
				
				# truncate all responses at 500 characters, not the t/f tho
				QAs[1] = if QAs[1]? then QAs[1].substring(0,500) else ""
				QAs[3] = if QAs[3]? then QAs[3].substring(0,500) else ""
				QAs[4] = if QAs[4]? then QAs[4].substring(0,500) else ""
								
				# collect data
				appData =
					firstName: req.body.firstName
					lastName: req.body.lastName
					email: req.body.email
					school: req.body.school
					major: req.body.major
					year: req.body.year
					github: req.body.github
					status: 'pending'
					# resume: req.body.resume DO IN SIGNUP INSTEAD
					QAs: QAs
				
				#submit to parse
				app.kaiseki.createObject 'Applications', appData, (error, result, body, success) ->
					if success
						console.log " > Parse - App submit success"
						
						app.emailTemplate 'applyConfirm', 
							to_email: appData.email
							from_email: 'register@hackfsu.com'
							from_name: 'HackFSU'
							subject: 'Rad Submission, Man'
							locals:
								firstName: appData.firstName
								lastName: appData.lastName
						
						#reply with result
						res.send
							appValid: true

					else
						console.log " > Parse - App submit failed"
						console.log "   > " + JSON.stringify error
						console.log "   > " + JSON.stringify body
						
						#reply with result
						res.send
							appValid: false
							parse:
								error: error
								code: body.code
								msg: body.msg
							
			else
				console.log "Application input error occurred"
				console.log JSON.stringify inputErrors
				res.send
					appValid: false
					inputErrors: inputErrors
		
		########################################################################
		# Attendance confimation
		# id = randomly generated and sent via email
		########################################################################
		@confirm = (req, res) ->
			title = 'Attendance Confimation'
			view = 'public/confirm'
			
			#test id
			if req.params.confirmationId?
				cId = req.params.confirmationId
				p = app.models.Applications.generateNewConfirmationId()

				p = app.models.Applications.getAppSimpleByConfirmationId(cId)
				p.then (appl)-> #resolve
					# console.log 'appl= ' + JSON.stringify appl, undefined, 2
					
					if appl.valid
						console.log 'Valid confirmation id "' + cId + '" for ' + 
							appl.firstName + ' ' + appl.lastName
							
						res.render view,
							title: title
							foundApp: true
							appData: appl
							confirmationId: cId
					else
						console.log 'Invalid confirmation id "' + cId + '"'
						res.render view,
							title: title
							foundApp: false
							msg: 'Invalid confirmation id "' + cId + '"'
									
				, ()-> #reject
					console.log 'Failed to check confirmationId ' + cId
					
					res.render view,
						title: title
						foundApp: false
						msg: 'Problem checking confirmation id, try refreshing this page.'
				
			else
				# no id found in request
				res.render view,
					title: title
					foundApp: false
					msg: 'Confirmation id not found'
		
		@confirm_submit = (req, res) ->
			#TODO: server-side validation
			
			#get post data
			confirmData =
				confirmationId: 	if req.body.confirmationId?	then req.body.confirmationId else null
				going: 				if req.body.going?				then req.body.going else null
				phoneNumber: 		if req.body.phoneNumber?		then req.body.phoneNumber else null
				emergencyContact: if req.body.emergencyContact?	then req.body.emergencyContact else null
				tshirt: 				if req.body.tshirt?				then req.body.tshirt else null
				specialNeeds: 		if req.body.specialNeeds?		then req.body.specialNeeds else null
				# resume: 				null # do after
				diet: 				if req.body.diet?					then req.body.diet else null
				comments: 			if req.body.comments?			then req.body.comments else null
				agreement: 			if req.body.agreement?			then req.body.agreement else null
				gender: 				if req.body.gender?				then req.body.gender else null
				bday: 				if req.body.bday?					then req.body.bday else null
				under18:				if req.body.under18?				then req.body.under18 else null
				
			if confirmData.confirmationId?
				#run it all
				p = app.models.Applications.confirmSave(confirmData)
				p.then ()->
					res.send
						success: true
				, ()->
					res.send
						success: false
						msg: 'Something went wrong saving'
			else
				res.send
					success: false
					msg: 'Missing confirmationId'
				
				return 
		