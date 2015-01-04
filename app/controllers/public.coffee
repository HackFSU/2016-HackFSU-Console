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
				
		@signup = (req, res) ->
			res.render 'public/signup',
				title: 'Sign Up'
		
		@updates = (req, res) ->
			res.render 'public/updates',
				title: 'Updates'
		
		@schedule = (req, res) ->
			res.render 'public/schedule',
				title: 'Schedule'
		
		########################################################################
		# Signin
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
						
						res.redirect '/signin'
				
			else
				console.log 'Invalid input'
				res.redirect '/signin'