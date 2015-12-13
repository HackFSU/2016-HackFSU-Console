$(window).bind('scroll resize', function() {
		var currentSection = null;

		$('.section').each(function(){
				var element = $(this).attr('id');
				if ($('#'+element).is('*')){
						if($(window).scrollTop() >= $('#'+element).offset().top - 90)
						{
								currentSection = element;
						}
				}
		});

		$('#main-menu ul li').removeClass('active').find('a[href="#'+currentSection+'"]').parent().addClass('active');

	jQuery('select.small-menu option:selected').removeAttr('selected');
	jQuery('select.small-menu option[value="#'+currentSection+'"]').attr('selected', 'selected');
});

jQuery(document).ready(function() {
	$("#main-menu").sticky({ topSpacing: 0 });
	$('#main-menu ul li a, a.slow-scroll').click(function() {
		$('html, body').animate({scrollTop: $(this.hash).offset().top}, 2000);
			return false;
	});
	$(".scroll-top, .menu-logo").click(function() {
		jQuery('html, body').animate({scrollTop: 0}, 2000);
		return false;
	});
});
