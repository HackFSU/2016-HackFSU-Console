jQuery(document).ready(function() {


	jQuery('.main-menu').after('<div class="small-menu hidden"></div>');
	jQuery('.small-menu').html(jQuery('.main-menu').html());

	jQuery('.menu-logo').after('<div class="small-menu-logo right hidden"><img src="/assets/vendor/drythemes-sensa/images/small-menu-logo.png" alt="" /></div>');



    if (jQuery(document).width() < 790 ) {
		jQuery('.main-menu ul').css({"float":"none"}).addClass('clear');
		jQuery('.main-menu .menu-holder ul').css({"display":"none"});
		jQuery('.main-menu li a').css({"border-top-width":"0"});
		jQuery('.main-menu').addClass('small-menu-background');
		jQuery('div.main-menu .menu-holder ul li').css({"display":"block"});
		jQuery('.small-menu-logo').show();

    }
    else {
		jQuery('.main-menu ul').css({"float":"right"}).removeClass('clear');
		jQuery('.main-menu .menu-holder ul').css({"display":"inline-block"});
		jQuery('.main-menu li a').css({"border-top-width":"3px"});
		jQuery('.main-menu').removeClass('small-menu-background');
		jQuery('div.main-menu .menu-holder ul li').css({"display":"inline-block"});
		jQuery('.small-menu-logo').hide();

    }

});

jQuery(window).resize(function(){

 if (jQuery(document).width() < 790 ) {
		jQuery('.main-menu ul').css({"float":"none"}).addClass('clear');
		jQuery('.main-menu .menu-holder ul').css({"display":"none"});
		jQuery('.main-menu li a').css({"border-top-width":"0"});
		jQuery('.main-menu').addClass('small-menu-background');
		jQuery('div.main-menu .menu-holder ul li').css({"display":"block"});
		jQuery('.small-menu-logo').show();
    }


else
{
		jQuery('.main-menu ul').css({"float":"right"}).removeClass('clear');
		jQuery('.main-menu .menu-holder ul').css({"display":"inline-block"});
		jQuery('.main-menu li a').css({"border-top-width":"3px"});
		jQuery('.main-menu').removeClass('small-menu-background');
		jQuery('div.main-menu .menu-holder ul li').css({"display":"inline-block"});
		jQuery('.small-menu-logo').hide();

}

});
