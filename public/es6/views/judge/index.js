/**
 * Handle form submission
 */

(function() {
	'use strict';

	const SUBMIT_URL = '/judge';

	let submitBtn = $('#endjudge');
	let categoryOptions = $('select.category');
	let sliders = $('#jslider1, #jslider2, #jslider3');

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

		sliders.forEach(function(sl) {
			sl = $(sl);
			let id = sl.data('hackId');
			let val = sl.noUiSlider.get();
			if(val > 0) {
				for(let i = 0; i < val; ++i) {
					data.points.push(id);
				}
			}
		});

		console.log('DATA', data);


		// $('#judgemain').hide();
		// $('#judge2').hide();
		// $('#judge3').fadeIn("slow");
		// window.scrollTo(0, 0);
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
