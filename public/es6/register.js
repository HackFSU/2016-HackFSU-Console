(function($) {
	'use strict';

	let $errorMessages = $('#error-messages');
	let $submitBtn = $('button[type="submit"]');

	$.validate({
		form: '#application',
		modules: 'html5, security',
		borderColorOnError: '#ef626c',
		errorElementClass: 'form-error',
		errorMessagePosition: $errorMessages,
		scrollToTopOnError: false,
		onError: function($form) {
			console.log(`Validation of form ${$form.attr('id')} failed!`);
			$submitBtn.shakeIt();
			setTimeout(function() {
				$('html, body').animate({
					scrollTop: $('.has-error').offset().top - 60
				}, 500);
			}, 500);
		},
		onSuccess: function($form) {
			// disable submit button
			$('button[type=submit]').attr('disabled', 'disabled');
		}
	});
})(jQuery);
