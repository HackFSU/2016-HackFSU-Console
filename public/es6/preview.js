/**
 * Preview page
 * 
 * Dependencies:
 * 	- jQuery
 * 	- hackform
 * 	
 * Handles form submission for email subscribing
 */


(function($) {
	'use strict';

	let form = $('form[name="previewEmailSubscribe"]');
	let submitBtn = form.find('button[type="submit"]');
	let submitting = false;
	
	form.hackForm({
		fields: [{
			element: form.find('input[name="email"]'),
			validator: 'email'
		}]
	});

	form.on('submit', function(ev) {
		ev.preventDefault();
		console.log('submiting');
		if(submitting) {
			return;
		}

		submitting = true;
		if(form.hackForm('validate')) {
			$.ajax({
				type: 'post',
				url: '/preview/subscribe',
				data: JSON.stringify(form.hackForm('get')),
				contentType: 'application/json',
				success: function(res) {
					form.hackForm('end', res.err);
					submitting = false;
				},
				error: function(err) {
					form.hackForm('end', {message: err});
					submitting = false;
				}
			});
		} else {
			submitBtn.shakeIt();
			submitting = false;
		}
	});

	submitBtn.on('click', function() {
		form.submit();
	});

})(jQuery);