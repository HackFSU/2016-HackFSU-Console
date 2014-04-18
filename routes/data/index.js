exports.index = function(kaiseki) {
    return function(req, res) {
        kaiseki.getUsers({
                limit: 500,
                count: true
            },
            function(err, result, body, success) {
                var checkIns = 0;

                body.results.forEach(function(user) {
                    if (user.checkedin) {
                        checkIns++;
                    }
                })

                res.render('data/index', {
                    title: 'Users',
                    count: body.count,
                    checkins: checkIns,
                    users: body.results
                });
            });
    };
};
