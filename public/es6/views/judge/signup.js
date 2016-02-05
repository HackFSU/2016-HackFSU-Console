/**
 * For /judge
 * Handles non-user judge signup
 */

(function() {
	'use strict';

	const POST_URL = '/judge/signup';
	const FORM_SELECTOR = '#signup';

	let errorView = $('#errors');
	let errorMessages = errorView.find('#error-messages');
	let confirmation = $('#confirmation');
	let form = $(FORM_SELECTOR);
	let submitBtn = form.find('#submit');

	$.validate({
		form: FORM_SELECTOR,
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
					scrollTop: $('.has-error').eq(0).offset().top - 60
				}, 500);
			}, 500);
		},
		onSuccess: function(form) {
			submitBtn.prop('disabled', true);

			let formData = $(form).serialize();
			let initialButtonText = submitBtn.text();

			submitBtn.text('...');

			saveResult(formData)
			.then(function() {
				errorView.remove();
				form.fadeTo(1000, 0, function() {
					form.remove();
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					confirmation.fadeIn(1000, function() {
						return;
					});
				});
			})
			.catch(function(err) {
				console.error(err);
				showError(typeof err === 'string'? err : 'Server error, check console.');
				submitBtn.prop('disabled', false);
				submitBtn.text(initialButtonText);
			});

			return false;
		}
	});

	function saveResult(data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				type: 'POST',
				url: POST_URL,
				data: data,
				success: function(res) {
					if(res.error) {
						reject(res.error);
					} else {
						resolve();
					}
				},
				error: function(err) {
					reject(err);
					return;
				}
			});
		});
	}


	function showError(err) {
		errorMessages.empty();
		errorMessages.append(`
			<p>
				<strong>Uh oh!</strong> ${capitalizeFirstLetter(err)}
			</p>
		`);
		errorView.show();
		$('html, body').animate({
			scrollTop: 0
		}, 500);
	}

	function capitalizeFirstLetter(string) {
		string = String(string);
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
})();
