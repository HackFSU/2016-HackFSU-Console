'use strict';

(function ($) {
	'use strict';

	var $errorMessages = $('#error-messages');
	var $submitBtn = $('button[type="submit"]');

	$.validate({
		form: '#mentor',
		modules: 'html5, security',
		borderColorOnError: '#ef626c',
		errorElementClass: 'form-error',
		errorMessagePosition: $errorMessages,
		scrollToTopOnError: false,
		onError: function onError($form) {
			console.log('Validation of form ' + $form.attr('id') + ' failed!');
			$submitBtn.shakeIt();
			setTimeout(function () {
				$('html, body').animate({
					scrollTop: $('.has-error').offset().top - 120
				}, 500);
			}, 500);
		},
		onSuccess: function onSuccess(form) {
			// disable submit button
			$('button[type=submit]').attr('disabled', 'disabled');
			var formData = $(form).serialize();

			$.ajax({
				type: 'POST',
				url: '/mentor',
				data: formData,
				success: function success(res) {
					if (res.error) {
						console.log(res.error);
						$('#error-messages').empty();
						$('#error-messages').append('<p><strong>Uh oh!</strong> ' + capitalizeFirstLetter(res.error) + '</p>');
						$('#errors').show();
						$('html, body').animate({
							scrollTop: 0
						}, 500);

						$('button[type="submit"]').attr('disabled', false);
					} else {
						// Just in case the error messages were displayed, remove them
						$('#errors').remove();
						$('#mentor').fadeTo(1000, 0, function () {
							$('#mentor').remove();
							$('html, body').animate({
								scrollTop: 0
							}, 500);
							$('#confirmation').fadeIn(1000, function () {
								return;
							});
						});
					}
				},
				error: function error(err) {
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
//# sourceMappingURL=mentor.js.map
