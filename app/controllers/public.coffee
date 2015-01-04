module.exports = (app) ->
	class app.PublicController
		@index = (req, res) ->
			res.render 'index',
				title: 'Home'
				
		@error = (req, res) ->
			if req.body.errorMsg?
				msg = req.body.errorMsg
			else
				msg = "Jk, there was no error."
			
			res.render 'public/error',
				title: "Error!"
				errorMsg: msg
		
		@contact = (req, res) ->
			res.render 'public/contact',
				title: 'Contact'
				
		@apply = (req, res) ->
			res.render 'public/apply',
				title: 'Apply'
				
		@signup = (req, res) ->
			res.render 'public/signup',
				title: 'Sign Up'
				
		@signin = (req, res) ->
			res.render 'public/signin',
				title: 'Sign In'
		
		@updates = (req, res) ->
			res.render 'public/updates',
				title: 'Updates'
		
		@schedule = (req, res) ->
			res.render 'public/schedule',
				title: 'Schedule'
			