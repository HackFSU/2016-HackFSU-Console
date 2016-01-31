'use strict';

$('#judge2').hide();
$('#judge3').hide();

$('#beginjudge').click(function() {
	$('#judgemain').toggle();
	$('#judge2').fadeIn("slow");
	window.scrollTo(0, 0);
});


$('#endjudge').click(function() {
	$('#judgemain').hide();
	$('#judge2').hide();
	$('#judge3').fadeIn("slow");
	window.scrollTo(0, 0);
});



var jslider1 = document.getElementById('jslider1');
var jslider2 = document.getElementById('jslider2');
var jslider3 = document.getElementById('jslider3');

noUiSlider.create(jslider1, {
	start: [ 0 ],
	range: {
		'min': [  0 ],
		'max': [ 3 ]
	},
	step: 1,
	connect: 'lower'
});

noUiSlider.create(jslider2, {
	start: [ 0 ],
	range: {
		'min': [  0 ],
		'max': [ 3 ]
	},
	step: 1,
	connect: 'lower'
});

noUiSlider.create(jslider3, {
	start: [ 0 ],
	range: {
		'min': [  0 ],
		'max': [ 3 ]
	},
	step: 1,
	connect: 'lower'
});

var BASE = 3;
var last = null;
var total = BASE;
var lastTotal = BASE;

jslider1.noUiSlider.on('update', function() {
	last = jslider1.getAttribute('id');
	lastTotal = total;
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
	console.log(lastTotal);
});

jslider2.noUiSlider.on('update', function() {
	last = jslider2.getAttribute('id');
	lastTotal = total;
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
	console.log(lastTotal);
});

jslider3.noUiSlider.on('update', function() {
	last = jslider3.getAttribute('id');
	lastTotal = total;
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
	console.log(lastTotal);
});

jslider1.noUiSlider.on('change', function() {
	document.getElementById("judgingpoints").innerHTML = total;
	if(total <= 0) {
		jslider1.setAttribute("disabled", true);
		jslider2.setAttribute("disabled", true);
		jslider3.setAttribute("disabled", true);
	}else{
		jslider1.removeAttribute("disabled");
		jslider2.removeAttribute("disabled");
		jslider3.removeAttribute("disabled");
	}
	if(total < 0) {
		document.getElementById(last).noUiSlider.set(lastTotal);
		document.getElementById("judgingpoints").innerHTML = 0;
	}
});

jslider2.noUiSlider.on('change', function() {
	document.getElementById("judgingpoints").innerHTML = total;
	if(total <= 0) {
		jslider1.setAttribute("disabled", true);
		jslider2.setAttribute("disabled", true);
		jslider3.setAttribute("disabled", true);
	}else{
		jslider1.removeAttribute("disabled");
		jslider2.removeAttribute("disabled");
		jslider3.removeAttribute("disabled");
	}
	if(total < 0) {
		document.getElementById(last).noUiSlider.set(lastTotal);
		document.getElementById("judgingpoints").innerHTML = 0;
	}
});

jslider3.noUiSlider.on('change', function() {
	document.getElementById("judgingpoints").innerHTML = total;
	if(total <= 0) {
		jslider1.setAttribute("disabled", true);
		jslider2.setAttribute("disabled", true);
		jslider3.setAttribute("disabled", true);
	}else{
		jslider1.removeAttribute("disabled");
		jslider2.removeAttribute("disabled");
		jslider3.removeAttribute("disabled");
	}
	if(total < 0) {
		document.getElementById(last).noUiSlider.set(lastTotal);
		document.getElementById("judgingpoints").innerHTML = 0;
	}
});
