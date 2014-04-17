exports.index = function(kaiseki) {
    return function(req, res) {
        res.render('updates/index', {
            title: 'Updates'
        });
    };
};
