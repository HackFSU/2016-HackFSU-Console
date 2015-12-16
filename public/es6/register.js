(function($) {
	'use strict';

	var handleFileSelect = function(evt) {
		var files = evt.target.files;
		var file = files[0];

		if (files && file) {
				var reader = new FileReader();

				reader.onload = function(readerEvt) {
						var binaryString = readerEvt.target.result;
						document.getElementById("resumeBase64").value = btoa(binaryString);
				};

				reader.readAsBinaryString(file);
		}
	};

if (window.File && window.FileReader && window.FileList && window.Blob) {
		document.getElementById('resume').addEventListener('change', handleFileSelect, false);
} else {
		alert('The File APIs are not fully supported in this browser.');
}

	let $errorMessages = $('#error-messages');
	let $submitBtn = $('button[type="submit"]');

	$.validate({
		form: '#application',
		modules: 'html5, security, file',
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
		onSuccess: function(form) {
			// disable submit button
			$('button[type=submit]').attr('disabled', 'disabled');
			let formData = $(form).serialize();

			$.ajax({
				type: 'post',
				url: '/register/submit',
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
						$('#application').fadeTo(1000, 0, function() {
							$('#application').remove();
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
