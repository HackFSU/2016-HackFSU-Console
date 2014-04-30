###
# Email controller
#
# Author: Trevor
###

module.exports = (app) ->
	class app.EmailController
		# Create new
		@new = (req, res) ->
			res.render 'email/new',
				title: 'Shoot an Email'