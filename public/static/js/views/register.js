'use strict';

(function ($) {
	'use strict';

	var form = $('form[name="register"]');
	var submitBtn = form.find('button[type="submit"]');
	var submitting = false;

	form.hackForm({
		fields: [{
			element: form.find('input[name="email"]'),
			validator: 'email'
		}]
	});

	form.on('submit', function (ev) {
		ev.preventDefault();
		console.log('in');

		if (submitting) {
			return;
		}

		submitting = true;
		if (form.hackForm('validate')) {
			$.ajax({
				type: 'post',
				url: '/register/submit',
				data: JSON.stringify(form.hackForm('get')),
				contentType: 'application/json',
				success: function success(res) {
					$('#register-content').fadeTo(1000, 0, function () {
						$('#register-content').remove();
						//form.hackForm('end', res.err);
						$("html, body").animate({
							scrollTop: 0
						}, 500);
						$('.hackform-success').fadeIn(1000, function () {
							//return
						});
					});

					submitting = false;
				},
				error: function error(err) {
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

	submitBtn.on('click', function () {
		form.submit();
	});
})(jQuery);
//# sourceMappingURL=register.js.map
