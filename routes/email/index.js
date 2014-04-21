module.exports = function (kaiseki) {
	return {
		index: index(kaiseki)
	};
};


function index(kaiseki) {
	return function(req, res) {
		res.render('email/index', {
			title: 'Shoot an Email'
		});
	};
}