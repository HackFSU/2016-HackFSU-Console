module.exports = (app) ->
	class app.PublicController
		@index = (req, res) ->
			res.render 'index',
				title: 'HackFSU Console'
				
		@error = (req, res) ->
			if req.body.errorMsg?
				msg = req.body.errorMsg
			else
				msg = "Jk, there was no error."
			
			res.render 'public/error',
				title: "Error!"
				errorMsg: msg