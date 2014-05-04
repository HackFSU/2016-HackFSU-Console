###
# Updates controller
#
# Author: Trevor Helms
###

module.exports = (app) ->
	class app.UpdatesController
		# View all updates
		@all = (req, res) ->
			params =
				count: true,
				order: '-createdAt'

			app.kaiseki.getObjects 'Updates', params, (err, result, body, success) ->
				res.render 'updates/all',
					title: 'Updates',
					updates: body.results,
					count: body.count

		# Add update to Parse
		@add = (req, res) ->
			# Validate input
			req.assert('updateTitle', "You can't update without a title!").notEmpty()
			req.assert('updateTitle', 'Title must be shorter than %2 characters.').len(1, 40)
			req.assert('updateMessage', 'You must specify a message!').notEmpty()

			errors = req.validationErrors()

			# Add to Parse if there weren't any validation errors
			if (!errors)
				update = 
					title: req.body.updateTitle,
					msg: req.body.updateMessage

				app.kaiseki.createObject 'Updates', update, (err, result, body, success) ->
					res.location '/updates/new'
					res.render 'updates/new',
						title: 'Create New Update'
			else
				res.location '/updates/new'
				res.render 'updates/new',
					title: 'Create New Update'

		# Create new update
		@new = (req, res) ->
			res.render 'updates/new',
				title: 'Create New Update'