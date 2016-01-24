/**
 * Handles user login
 */

(function($) {
	'use strict';

	let errorMessages = $('#error-messages');
	let submitBtn = $('button[type="submit"]');

	$.validate({
		form: '#login',
		modules: 'html5, security',
		borderColorOnError: '#ef626c',
		errorElementClass: 'form-error',
		errorMessagePosition: errorMessages,
		scrollToTopOnError: false,
		onError: function(form) {
			console.log(`Validation of form ${form.attr('id')} failed!`);
			submitBtn.shakeIt();
			setTimeout(function() {
				$('html, body').animate({
					scrollTop: $('.has-error').offset().top - 120
				}, 500);
			}, 500);
		},
		onSuccess: function(form) {
			console.log('logging in...');

			submitBtn.prop('disabled', true);

			let formData = $(form).serialize();

			submit(formData)
			.then(function() {
				// success, redirect
				console.log('success');
				window.location.href = '/user/profile';
			})
			.catch(function(err) {
				console.log(formData, err);
				submitBtn.prop('disabled', false);
			});

			return false;
		}
	});


	function submit(data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				type: 'POST',
				url: '/user/login',
				data: data,
				success: function(res) {
					if(res.error) {
						reject(res.error);
						return;
					}
					resolve(res);
				},
				error: function(err) {
					reject(err);
				}
			});
		});
	}

})(jQuery);
