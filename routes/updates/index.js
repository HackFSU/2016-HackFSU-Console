exports.index = function(kaiseki) {
    return function(req, res) {
        var params = {
            count: true
        };

        kaiseki.getObjects('Updates', params, function(err, result, body, success) {
            res.render('updates/index', {
                title: 'Updates',
                updates: body.results,
                count: body.count,
                timeAgo: timeAgo
            });
        });
    }
};

exports.add = function(kaiseki) {
    return function(req, res) {
        res.render('updates/add', {
            title: 'Add Update'
        });
    };
};

function timeAgo(time) {
	return Math.floor((Date.now() - Date.parse(time)) / 1000 / 60 / 60 / 24) + ' days ago';
}