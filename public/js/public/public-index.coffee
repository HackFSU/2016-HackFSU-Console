###

Route: `/`

Dependencies: 
	http://jedfoster.com/Readmore.js/
	jqeury

# Readmore ##################################################

$('.readmoreSect').readmore
	speed: 100
	collapsedHeight: 280
	moreLink: '<a class="readmoreLink link-text href="#">Read more</a>'
	lessLink: '<a class="readmoreLink link-text" href="#">Close</a>'
	embedCSS: false
	startOpen: false
	
# Rumble dem buttons on hover
# $('#applyBtn, #sponsorBtn, #logoBtn').jrumble()
$('#hypeBtn').jrumble
	x: 10
	y: 10
	rotation: 4
	opacity: true
	opacityMin: .75
	
	
$('#hypeBtn').hover ()->
	$(this).trigger 'startRumble'
	return
, () ->
	$(this).trigger 'stopRumble'

#Smooth scroll to sponsors
$('#sponsorBtn').click ()->
	$('html, body').animate
		scrollTop: $('[name=sponsors]').offset().top - 50
	, 2000
