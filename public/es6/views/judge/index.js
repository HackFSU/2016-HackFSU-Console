/**
 * Handle form submission
 */

(function() {
	'use strict';

	const SUBMIT_URL = '/judge';

	let submitBtn = $('#endjudge');
	let categoryOptions = $('select.categories');

	submitBtn.click(function(ev) {
		ev.preventDefault();
		if(submitBtn.is(':disabled')) {
			return;
		}
		submitBtn.prop('disabled', true);

		let data = {
			points: [],
			nominations: {}
		};

		// grab category vals
		categoryOptions.forEach(function(opt) {
			opt = $(opt);
			let name = opt.attr('name');
			let val = opt.val();
			if(val !== -1) {
				data.nominations[name] = val;
			}
		});

	});


	// post promise wrapper
	function post(url, data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'POST',
				url: url,
				data: data,
				success: function(res) {
					if(res.error) {
						reject(res.error);
					} else {
						resolve(res);
					}
				},
				error: reject
			});
		});
	}
})();
