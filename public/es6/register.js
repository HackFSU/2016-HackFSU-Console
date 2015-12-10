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
		//errorMessagePosition: $errorMessages,
		onError: function($form) {
			console.log(`Validation of form ${$form.attr('id')} failed!`);
			$submitBtn.shakeIt();
		},
		onSuccess: function($form) {
			return $.submitForm($form);
		}
	});

	$.submitForm = function($form) {
		let thisForm = $form;

		// disable submit button
		$('button[type=submit]').attr('disabled', 'disabled');

		let targetUrl =     $(thisForm).attr('action');
		let formData =      $(thisForm).serialize();
		console.log(formData);

		let request = $.ajax({
			url: targetUrl,
			type: "POST",
			data: formData,
			dataType: "json",
			success: formPostCompleted,
			statusCode: {
				409: validationServerFailed,
				500: serverError
			}
		});
	};

	let formPostCompleted = function(data, status)
	{    // write server response to console for troubleshooting
					console.log(data);
					console.log(status);

			 // hide graphic that shows form processing in progress
			$('#form_submit_progress').hide();

					// check if success
					if (data.success)
					{
							// show success message
							$('.alert-message.success').fadeIn(1000);

							// scroll up to the success message div
							$('html,body').animate({scrollTop: $(".alert-message.success").offset().top}, 'fast');

					} // end if success
	};// end formPostCompleted function *****************


	// validationServerFailed ***************
	// internal function called from jQuery ajax method when http status code=409
	let validationServerFailed = function(serverData)
	{    // write server response to console for troubleshooting
			 console.log(serverData);

			 // hide graphic that shows form processing in progress
			$('#form_submit_progress').hide();

			// parse the responseText json formatted string into a js object
			let data = jQuery.parseJSON(serverData.responseText);

			 // test if validation not correct
			 if (!data.validation_passed)
			 {   // for each errMsg, red outline form field, show msg
					 $.each(data.validation_messages,
							function(key, value)
							{   // change form field border to red
							 //   $('#'+key).css('border-color', 'red');
									// add class to form field
									$('#'+key).addClass('error');
									// get validation err msg from form field attr
									let errMsg = $('#'+key).attr('data-validation-error-msg');
									// create span, fill with errMsg, insert after input element
									$('<span class="error">'+errMsg+'</span>').insertAfter('#'+key);
							}
						);

			 } // end if validation not correct

			 // re-enable the submit button
			 $('input[type=submit]').attr('disabled',false);
			 $('input[type=submit]').removeAttr('disabled');

	};// end validationServerFailed function *****************



	// serverError **********************
	// internal function called from jQuery ajax method if server responds with 500 error
	let serverError = function(object, data, status)
	{
			// show server error message
			$('#server_error_message').html('Sorry, an error has occurred. The website administrator has been notified.');
			$('#server_error_message').css({'background-color':'yellow'});
			$('#server_error_message').show();

			// hide graphic that shows form processing in progress
			$(thisForm).find("#form_submit_progress").hide();

			// re-enable the submit button
			$('input[type=submit]').attr('disabled',false);
			$('input[type=submit]').removeAttr('disabled');
	};// end serverError ********************************

})(jQuery);
