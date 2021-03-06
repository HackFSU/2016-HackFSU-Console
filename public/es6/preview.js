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


	let video = $('#video');

	if(video.is(':visible')) {
		// Non-mobile, add video
		video.after('<video src="/assets/res/hackfsu17.mp4" loop="true" autoplay="true"></video>');
	}

	form.hackForm({
		fields: [{
			element: form.find('input[name="email"]'),
			validator: 'email'
		}]
	});

	form.on('submit', function(ev) {
		ev.preventDefault();

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
					$('#preview-content').fadeTo(1000, 0, function() {
						$('#preview-content').remove();
						//form.hackForm('end', res.err);
						$("html, body").animate({
								scrollTop: 0
						}, 500);
						$('.hackform-success').fadeIn(1000, function() {
							//return
						});
					});

					submitting = false;
				},
				error: function(err) {
					form.hackForm('end', err);
					$('#be-the-first').remove();
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
