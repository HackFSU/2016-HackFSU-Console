var kaiseki = require('../init.js').kaiseki;
var users = [];

exports.getUsers = function() {
    kaiseki.getUsers({
            limit: 500
        },
        function(err, res, body, success) {
            users = body;
            console.dir(body.reduce(function(memo, item) {
                //console.log(item.name);
                
            }), {});

            console.log(users);
    });

    return users;
}

