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
var total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));

jslider1.noUiSlider.on('update', function() {
	document.getElementById("jslidervalue1").innerHTML = jslider1.noUiSlider.get();
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
});

jslider2.noUiSlider.on('update', function() {
	document.getElementById("jslidervalue2").innerHTML = jslider2.noUiSlider.get();
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
});

jslider3.noUiSlider.on('update', function() {
	document.getElementById("jslidervalue3").innerHTML = jslider3.noUiSlider.get();
	total = BASE - (parseInt(jslider1.noUiSlider.get()) + parseInt(jslider2.noUiSlider.get()) + parseInt(jslider3.noUiSlider.get()));
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
});