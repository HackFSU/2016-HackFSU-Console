module.exports = function(kaiseki) {
	return {
		index: index(kaiseki),
		add: add(kaiseki)
	}
}

function index(kaiseki) {
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

function add(kaiseki) {
    return function(req, res) {
        res.render('updates/add', {
            title: 'Add Update'
        });
    };
};

/*
* Converts a time string into a string representing the "time ago" since then
* Example: 5 seconds ago, 3 hours ago
*/
function timeAgo(time) {
	var millis = Date.parse(time);
	var daysAgo = (Date.now() - millis) / 1000 / 60 / 60 / 24;

	if (daysAgo >= 1) {
		var ago = (daysAgo >= 2) ? ' days ago' : ' day ago'; 
		return Math.floor(daysAgo) + ago;
	}

	var hoursAgo = daysAgo * 24;

	if (hoursAgo >= 1) {
		var ago = (hoursAgo >= 2) ? ' hours ago' : ' hour ago'; 
		return Math.floor(hoursAgo) + ago;
	}

	var minsAgo = hoursAgo * 60;

	if (minsAgo >= 1) {
		var ago = (minsAgo >= 2) ? ' minutes ago' : ' minute ago'; 
		return Math.floor(minsAgo) + ago;
	}

	var secsAgo = minsAgo * 60;
	var ago = (secsAgo >= 2) ? ' seconds ago' : ' second ago'; 
	return Math.floor(secsAgo) + ago;
}