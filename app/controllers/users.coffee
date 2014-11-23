module.exports = (app) ->
	class app.UsersController
		@all = (req, res) ->
			app.kaiseki.getUsers
				limit: 500,
				count: true
			,
			(err, result, body, success) ->
				checkIns = 0;

				body.results.forEach (user) ->
					checkIns++ if user.checkedin

				res.render 'users/all',
					title: 'Users',
					count: body.count,
					checkins: checkIns
					users: body.results
		
		@signin = (req, res) ->
			
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
				
			if isValidInput
				# check parse
				app.kaiseki.loginUser req.body.username, req.body.password,
					(error, response, body, success) ->
						# log the result
						msgs = []
						
						if success
							msgs.push("PARSE - LOGIN SUCCESS!")
							#TODO save parse session info
						else
							msgs.push("PARSE - LOGIN FAILURE!")
						
						msgs.push("> error: " + JSON.stringify error)
						msgs.push("> body: " + JSON.stringify body)
						for line in msgs 
							console.log(line)
			
			# failed
			res.render 'users/signin',
				title: 'Sign in'
				
		@signup = (req, res) ->
			
			res.render 'users/signup',
				title: 'Sign up'
		
		@signup_submit = (req, res) ->
			# validate form
			isValidInput = false;
			
			if req.body.firstName? and
			req.body.lastName? and
			req.body.email? and
			req.body.username? and
			req.body.password?
				# TODO: actually validate this. This checks existence only
				isValidInput = true; 
			
			userInfo = 
				username: req.body.username
				password: req.body.password
				firstName: req.body.firstName
				lastName: req.body.lastName
				email: req.body.email
			
			
			console.log "User submit " + JSON.stringify userInfo
			
			if isValidInput
			# 	userInfo = 
			# 		username: req.body.username
			# 		password: req.body.password
			# 		firstName: req.body.firstName
			# 		lastName: req.body.lastName
			# 		email: req.body.email
				
				
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

