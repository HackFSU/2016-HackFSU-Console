# Handles user sessions, signup, and profiles

module.exports = (app) ->
	class app.UsersController
		@signin = (req, res) ->
			# console.log("SIGNIN SESSION: " + JSON.stringify req.session)
			
			if req.session.signin == 1 			#signed in
				res.redirect('/users/profile');
			else
				if req.session.signin == 2 		#failed/no attempt
					console.log "Login failed!"
					req.session.signin = 0
				res.render 'users/signin',
					title: 'Sign in'
			
		@signin_submit = (req, res) ->
			isValidInput = false
			if req.body.username? and
			req.body.password?
				isValidInput = true
				
			userInfo =
				username: req.body.username
				password: req.body.password
			
			#reset signin flag
			req.session.signin = 0
			
			if isValidInput
				# check parse
				app.kaiseki.loginUser req.body.username, req.body.password,
					(error, response, body, success) ->
						# log the result
						msgs = []
						
						if success
							msgs.push("PARSE - LOGIN SUCCESS!")
							#TODO save parse session info
							req.session.parseSessionToken = body.sessionToken
							req.session.firstName = body.firstName
							req.session.lastName = body.lastName
							req.session.email = body.email
							req.session.isAdmin = body.isAdmin
							req.session.signin = 1
																							
						else
							msgs.push("PARSE - LOGIN FAILURE!")
							req.session.signin = 2
						
						msgs.push("> error: " + JSON.stringify error)
						msgs.push("> body: " + JSON.stringify body)
						for line in msgs 
							console.log(line)
						
						res.redirect '/users/signin'
				
			else
				console.log 'Invalid input'
				res.redirect '/users/signin'
				
		@signup = (req, res) ->
			res.render 'users/signup',
				title: 'Sign up'
		
		@signup_submit = (req, res) ->
			# validate form
			isValidInput = false;
			
			if req.body.firstName? and
			req.body.lastName? and
			req.body.email? and
			req.body.password?
				# TODO: actually validate this. This checks existence only
				isValidInput = true; 
			
			
			if isValidInput
				#console.log "User submit " + JSON.stringify userInfo
				userInfo = 
					username: req.body.email
					password: req.body.password
					firstName: req.body.firstName
					lastName: req.body.lastName
					email: req.body.email
					isAdmin: false			#manually assign admins
				
				app.kaiseki.createUser userInfo, 
					(error, response, body, success) ->
						msgs = []
						if success
							msgs.push("PARSE - SIGNUP SUCCESS!")
						else
							msgs.push("PARSE - SIGNUP FAILURE!")
						
						msgs.push("> error: " + JSON.stringify error)
						# msgs.push("> response: " + JSON.stringify response) this doesnt work 
						msgs.push("> body: " + JSON.stringify body)
							
						for line in msgs 
							console.log(line)
							
				res.render 'users/signin',
					title: 'Signin'
				
				
			else
				res.render 'error',
					title: 'Error!'
					pageData:
						errorMsg: 'Error: Invalid Input'
						backLocation: '/users/signup'
		
		
		@signout = (req, res) ->
			req.session.destroy()
			res.redirect '/'
			
		@profile  = (req, res) ->
			#console.log("PROFILE SESSION: " + JSON.stringify req.session)
			
			res.render 'users/profile',
				title: 'Profile'
				pageData:
					parseSessionToken: req.session.parseSessionToken
					firstName: req.session.firstName
					lastName: req.session.lastName
			

