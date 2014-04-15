require('../../src/init.js');

exports.index = function(req, res) {
	res.render('data/index', {
		title: 'Data Management'
	});
};