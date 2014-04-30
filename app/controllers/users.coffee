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