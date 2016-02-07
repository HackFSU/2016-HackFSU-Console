'use strict';

var jslider1 = document.getElementById('jslider1');
var jslider2 = document.getElementById('jslider2');
var jslider3 = document.getElementById('jslider3');

var total = 3;
var current = 0;

$('#judge2').hide();
$('#judge3').hide();

$('#beginjudge').click(function() {
	$('#judgemain').toggle();
	$('#judge2').fadeIn("slow");
	window.scrollTo(0, 0);
});
$('#judgerefresh').click(function() {
	location.reload();
});

$('#endjudge').click(function(e) {
	var form = $('#judgeform');
	var data = form.serialize();
	data += '&hack1=' + parseInt(jslider1.noUiSlider.get());
	data += '&hack2=' + parseInt(jslider2.noUiSlider.get());
	data += '&hack3=' + parseInt(jslider3.noUiSlider.get());
	$.ajax({
		type: 'POST',
		url: '/judge',
		data: data,
		success: function(res) {
			console.log(data);
		}
	});
	$('#judgemain').hide();
	$('#judge2').hide();
	$('#judge3').fadeIn("slow");
	window.scrollTo(0, 0);
	e.preventDefault();
});

noUiSlider.create(jslider1, {
	start: 0,
	range: {
		'min': 0,
		'max': 3
	},
	step: 1,
	connect: 'lower'
});

noUiSlider.create(jslider2, {
	start: 0,
	range: {
		'min': 0,
		'max': 3
	},
	step: 1,
	connect: 'lower'
});

noUiSlider.create(jslider3, {
	start: 0,
	range: {
		'min': 0,
		'max': 3
	},
	step: 1,
	connect: 'lower'
});

var s1 = 0, s2 = 0, s3 = 0;

jslider1.noUiSlider.on('change', function() {
	current = parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get());
	var diff = jslider1.noUiSlider.get() - s1;

	if (current > 3) {
		current -= diff;
		jslider1.noUiSlider.set(3 - current);
	}

	s1 = jslider1.noUiSlider.get();

	document.getElementById("judgingpoints").innerHTML = 3 - current;
});

jslider2.noUiSlider.on('change', function() {
	current = parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get());
	var diff = jslider2.noUiSlider.get() - s2;

	if (current > 3) {
		current -= diff;
		jslider2.noUiSlider.set(3 - current);
	}

	s2 = jslider2.noUiSlider.get();

	document.getElementById("judgingpoints").innerHTML = 3 - current;
});

jslider3.noUiSlider.on('change', function() {
	current = parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get());
	var diff = jslider3.noUiSlider.get() - s3;

	if (current > 3) {
		current -= diff;
		jslider3.noUiSlider.set(3 - current);
	}

	s3 = jslider3.noUiSlider.get();

	document.getElementById("judgingpoints").innerHTML = 3 - current;
});
