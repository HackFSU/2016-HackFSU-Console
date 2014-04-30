module.exports = (app) ->
	class app.StaticPagesController
		@index = (req, res) ->
			res.render 'index',
				title: 'HackFSU Console'