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
				
		@apply = (req, res) ->
			res.render 'public/apply',
				title: 'Apply'
				
		
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
			
			
				