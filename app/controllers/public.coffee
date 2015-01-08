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
						
						msgs.push("> error: " + JSON.stringify error)
						msgs.push("> body: " + JSON.stringify body)
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
			req.body.password?

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
							msgs.push("PARSE - SIGNUP SUCCESS!")
						else
							msgs.push("PARSE - SIGNUP FAILURE!")
						msgs.push("> error: " + JSON.stringify error)
						msgs.push("> body: " + JSON.stringify body)
						for line in msgs 
							console.log(line)
							
						if success
							req.flash('success', 'Sign up successful!')
							res.redirect '/signin'
						else
							req.flash('error', app.locals.helpers.getParseError(error,body))
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
			
		
			console.log JSON.stringify req.body, undefined, 2
			
			inputErrors = req.validationErrors(true)
			if(!inputErrors)
				#proceed to submit app
				
				# truncate all responses at 500 characters, not the t/f tho
				QAs = req.param('QAs')
				QAs[1] = if QAs[1] then QAs[1].substring(0,500) else ""
				QAs[2] = if QAs[2] then QAs[2].substring(0,500) else ""
				QAs[3] = if QAs[3] then QAs[3].substring(0,500) else ""
				QAs[4] = if QAs[4] then QAs[4].substring(0,500) else ""
				QAs[5] = if QAs[5] then QAs[5].substring(0,500) else ""
				
				# collect data
				appData =
					firstName: req.param('firstName')
					lastName: req.param('lastName')
					email: req.param('email')
					school: req.param('school')
					major: req.param('major')
					year: req.param('year')
					github: req.param('github')
					# resume: req.body.resume DO IN SIGNUP INSTEAD
					QAs: QAs
				
				#submit to parse
				app.kaiseki.createObject 'Applications', appData, (error, result, body, success) ->
					if success
						console.log "Parse - App submit success"
						
						#get email
						htmlEmail = app.locals.helpers.genEmail 'applicationConfirmation',
							firstName: appData.firstName
						
						if htmlEmail != null
							# send a confirmation email
							message = 
								'html': htmlEmail,
								'subject': 'We\'ve Received Your HackFSU Application!',
								'from_email': 'register@hackfsu.com',
								'from_name': 'HackFSU Application'
								'to': [
									'email': appData.email,
									'name': req.body.firstName + ' ' + req.body.lastName,
									'type': 'to'
								]	
							app.mandrill.messages.send 'message': message, 'async': false, (result) ->
								 console.log("Mandrill - Email Sent Success")   
							, (e) ->
								 console.log 'Mandrill - Error: ' + e.name + ' - ' + e.message
						
						#reply with result
						res.send
							appValid: true

					else
						console.log "Parse - App submit failed"
						console.log "> " + JSON.stringify error
						console.log "> " + JSON.stringify body
						
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
			
			