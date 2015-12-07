
$(function() {
	'use strict';


	let form = $('form[name="register"]');
	let submitBtn = form.find('button[type="submit"]');
	let submitting = false;

	form.hackForm({
		fields: [
			{
				element: form.find('input[name="email"]'),
				validator: 'email'
			},
			{
				element: form.find('input[name="firstName"]'),
				validator: 'notEmpty'
			},
			{
				element: form.find('input[name="lastName"]'),
				validator: 'notEmpty'
			},
			{
				element: form.find('input[name="school"]'),
				validator: 'notEmpty'
			},
			{
				element: form.find('input[name="password"]'),
				validator: 'notEmpty'
			},
			{
				element: form.find('input[name="passwordconfirm"]'),
				validator: 'samePassword',
			},
			{
				element: form.find('select[name="year"]'),
				validator: 'yearPicked'
			}

	]
	});

	form.on('submit', function(ev) {
		ev.preventDefault();

		console.log('in');

		if(submitting) {
			console.log('wtf?');
			return;
		}

		submitting = true;
		if(form.hackForm('validate')) {
			console.log('Are we here?');
			$.ajax({
				type: 'post',
				url: '/register/submit',
				data: JSON.stringify(form.hackForm('get')),
				contentType: 'application/json',
				success: function(res) {
					$('#register-content').fadeTo(1000, 0, function() {
						$('#register-content').remove();
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
			console.log('errors?');
			submitBtn.shakeIt();
			submitting = false;
			return;
		}

	});

	submitBtn.click(function() {
		form.submit();
	});


});
