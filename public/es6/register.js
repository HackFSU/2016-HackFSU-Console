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
		modules: 'html5, security',
		borderColorOnError: '#ef626c',
		errorElementClass: 'form-error',
		errorMessagePosition: $errorMessages,
		scrollToTopOnError: false,
		onError: function($form) {
			console.log(`Validation of form ${$form.attr('id')} failed!`);

			// // Generate a JSON object for the form data
			// let formData = {};
			// $('input, select, textarea').each(function() {
			// 	let input = $(this);
			// 	if (input.attr('type') === 'checkbox') {
			// 		formData[input.attr('name')] = [];
			// 		input.each(function() {
			// 			formData[input.attr('name')].push(this.checked ? $(this).val() : '' );
			// 		});
			// 	}
			// 	else {
			// 		formData[input.attr('name')] = input.val();
			// 	}
			// });
			//
			// console.log(formData);
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
			// console.log(formData);

			// // Generate a JSON object for the form data
			// let formData = {};
			// $('input, select, textarea').each(function() {
			// 	let input = $(this);
			// 	if (input.attr('type') === 'checkbox') {
			// 		formData[input.attr('name')] = [];
			// 		input.each(function() {
			// 			formData[input.attr('name')].push($(this).prop('checked') ? $(this).val : '' );
			// 		});
			// 	}
			// 	formData[input.attr('name')] = input.val();
			// });
			//
			// console.log(formData);
			//
			$.ajax({
				type: 'post',
				url: '/register/submit',
				data: formData,
				success: function() {
					console.log('success');
				},
				error: function(err) {
					console.log(err);
				}
			});

			return false;
		}
	});
})(jQuery);
