(function($) {
	'use strict';

	let $errorMessages = $('#error-messages');
	let $submitBtn = $('button[type="submit"]');

	$.validate({
		form: '#confirm',
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
					scrollTop: $('.has-error').offset().top - 120
				}, 500);
			}, 500);
		},
		onSuccess: function(form) {
			// disable submit button
			$('button[type=submit]').attr('disabled', 'disabled');
			let formData = $(form).serialize();

			$.ajax({
				type: 'POST',
				url: '/confirm',
				data: formData,
				success: function(res) {
					if (res.error) {
						console.log(res.error);
						$('#error-messages').empty();
						$('#error-messages').append('<p><strong>Uh oh!</strong> ' + capitalizeFirstLetter(res.error) + '</p>');
						$('#errors').show();
						$('html, body').animate({
							scrollTop: 0
						}, 500);

						$('button[type="submit"]').attr('disabled', false);
					}
					else {
						// Just in case the error messages were displayed, remove them
						$('#errors').remove();
						$('#confirm').fadeTo(1000, 0, function() {
							$('#confirm').remove();
							$('html, body').animate({
								scrollTop: 0
							}, 500);
							$('#confirmation').fadeIn(1000, function() {
								return;
							});
						});
					}
				},
				error: function(err) {
					console.log(err);
					$('#error-messages').empty();
					$('#error-messages').append('<p><strong>Uh oh!</strong> ' + capitalizeFirstLetter(err) + '</p>');
					$('#errors').show();
					$('html, body').animate({
						scrollTop: 0
					}, 500);

					$('button[type="submit"]').attr('disabled', false);
					return;
				}
			});

			return false;
		}
	});

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
})(jQuery);
