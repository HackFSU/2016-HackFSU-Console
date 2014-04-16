var user = require('../../src/data/user.js');
var kaiseki = require('../../src/init.js').kaiseki;

exports.index = function(req, res) {

    function getPeople(res) {
        var users = user.getUsers(res);
        //callback(users);
    }

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


    //getPeople(res);
};
