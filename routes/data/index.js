var kaiseki = require('../../src/init.js').kaiseki;

exports.index = function(req, res) {
    kaiseki.getUsers({
            limit: 500
        },
        function(err, result, body, success) {
            //users = body;
            res.render('data/index', {
                title: 'Data Management',
                people: body
            });
        });
};
