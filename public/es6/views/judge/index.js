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
			nominations: {},
			roundId: $('#judgemain').data('roundId')
		};

		console.log('CAT', categoryOptions);
		console.log('SL', sliders);

		// grab category vals
		$.each(categoryOptions, function(index, opt) {
			opt = $(opt);
			let name = opt.attr('name');
			let val = opt.val();
			if(val !== "-1") {
				data.nominations[name] = val;
			}
		});

		$.each(sliders, function(index, sl) {
			sl = $(sl);
			let id = sl.data('hackId');
			let val = sl[0].noUiSlider.get();
			if(val > 0) {
				for(let i = 0; i < val; ++i) {
					data.points.push(id);
				}
			}
		});

		console.log('DATA', data);

		post(SUBMIT_URL, data)
		.then(function() {
			$('#judgemain').hide();
			$('#judge2').hide();
			$('#judge3').fadeIn("slow");
			window.scrollTo(0, 0);
		})
		.catch(function(err) {
			console.err(err);
			alert('Submit Error, see log');
			submitBtn.prop('disabled', false);
		});

	});


	// post promise wrapper
	function post(url, data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'POST',
				url: url,
				data: {
					data: JSON.stringify(data)
				},
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
