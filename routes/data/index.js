var user = require('../../src/data/user.js');

exports.index = function(req, res) {
    var users;

    function getPeople(callback) {
        users = user.getUsers();
        callback(users);
    }

    function render(users) {
        res.render('data/index', {
            title: 'Data Management',
            people: users
        });
    }

    getPeople(render);
};
