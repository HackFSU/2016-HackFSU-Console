exports.index = function(req, res) {
	res.render('index', {
		active: 'home',
		title: 'HackFSU Console'
	});
};