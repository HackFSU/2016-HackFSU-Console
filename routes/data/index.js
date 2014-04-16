var kaiseki = require('../../src/init.js').kaiseki;

exports.index = function(req, res) {
    kaiseki.getUsers({
            limit: 500,
            count: true
        },
        function(err, result, body, success) {
            res.render('data/index', {
                title: 'Data Management',
       			count: body.count,
                users: body.results
            });
        });
};
