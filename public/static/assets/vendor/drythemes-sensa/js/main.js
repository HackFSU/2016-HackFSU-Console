jQuery(document).ready(function() {

    function pad(n) {
      return (n < 10) ? ("0" + n) : n;
    }

    var countto = 1396717200;

    function updateTime () {
      var timeto = Math.floor(countto - (Date.now() / 1000));
      var days = Math.floor(timeto / (60 * 60 * 24));
      timeto -= (days * 60 * 60 * 24);

      var hours = Math.floor(timeto / (60 * 60));
      timeto -= (hours * 60 * 60);

      var minutes = Math.floor(timeto / (60));
      timeto -= (minutes * 60);


      //$('.big-countdown').html(pad(days) + " days. " + pad(hours) + " hours. <br>" + pad(minutes) + " minutes. " + pad(timeto) + " seconds. ");
      $('.big-countdown').html(pad(days) + "d " + pad(hours) + "h " + pad(minutes) + "m " + pad(timeto) + "s ");
    }

    //updateTime();

    //setInterval(updateTime, 1000);

    jQuery(".home").height(jQuery(window).height() - 150);

/*
    //Set home section to be always full screen
    if (jQuery(window).height() > jQuery("#dry-home").innerHeight()) {
        jQuery(".home").height(jQuery(window).height() - 150);
    } else {
        jQuery(".home").height('auto');
    }

    */

    displayHints();

    //Home Background slider
    jQuery.supersized({
        slide_interval: 3000, // Length between transitions
        transition: 0, // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed: 700, // Speed of transition
        slide_links: 'blank', // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides: [ // Slideshow Images
            {
                image: '/assets/img/landingOne.jpg'
            },
            /*{image : 'images/header_image_02.jpg'},
                                {image : 'images/header_image_03.jpg'}
                                */
        ]
    });

});

jQuery(window).load(function() {

    //Fix for hash
    var hash = location.hash;
    if (hash != '') {
        setTimeout(function() {
            window.location.hash = '#';
            window.location.hash = hash;
        }, 10);
    }

    //Testimonial slider configuration
    jQuery("#testimonial").carouFredSel({
        responsive: true,
        width: '100%',
        auto: false,
        pagination: "#testimonial_pager",
        scroll: {
            fx: 'uncover-fade'
        },
        swipe: {
            onMouse: true,
            onTouch: true
        },
        items: {
            height: 'variable',
            start: 1
        }
    });


    //Set Accordions and Tabs
    jQuery(".accordion").accordion();
    jQuery(".tabs").tabs();

    // Fix for Vimeo and YouTube Video to be Full Screen
    jQuery(".vimeo, .youtube").each(function() {
        var vimeo_width = jQuery(this).width();
        var vimeo_height = vimeo_width * 16 * 7 / (90 * 2.2);
        jQuery(this).find('iframe').css('height', vimeo_height);
    });


    commentFormWidthFix();

    //Isotope
    var $container = $('#container');

    $container.isotope({
        getSortData: {
            category: function($elem) {
                return $elem.attr('data-category');
            }
        },
        animationEngine: 'jquery'
    });

    var $optionSets = $('#options .option-set'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function() {
        var $this = $(this);
        // don't proceed if already selected
        if ($this.hasClass('selected')) {
            return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');

        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[key] = value;
        if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
            // changes in layout modes need extra logic
            changeLayoutMode($this, options)
        } else {
            // otherwise, apply new options
            $container.isotope(options);
        }
        $(".isotope-item").fadeIn();
        $(".isotope-item.isotope-hidden").fadeOut();
        return false;
    });



    //Image slider configuration
    jQuery('#featured_work_image_slider').carouFredSel({
        responsive: true,
        width: '100%',
        auto: false,
        scroll: 1,
        prev: '#featured_work_prev',
        next: '#featured_work_next',
        swipe: {
            onMouse: false,
            onTouch: false
        },
        items: {
            width: 400,
            height: 'auto', //  optionally resize item-height
            visible: {
                min: 1,
                max: 3
            },
            start: 0
        }
    });



    //Fix for slider pagination
    if (jQuery(document).width() < 840) {
        jQuery('.slider_holder').each(function() {
            var pagination_width = jQuery(this).find('.carousel_pagination').first().width();
            var windw_width = jQuery(this).width();
            jQuery(this).find('.carousel_pagination').first().css("margin-left", (windw_width - pagination_width) / 2);
        });
    } else {
        jQuery('.carousel_pagination').css("margin-left", "160px");
    }




    //PrettyPhoto initial
    jQuery('a[data-rel]').each(function() {
        jQuery(this).attr('rel', jQuery(this).data('rel'));
    });

    jQuery("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast',
        /* fast/slow/normal */
        slideshow: false,
        /* false OR interval time in ms */
        autoplay_slideshow: false,
        /* true/false */
        opacity: 0.80,
        /* Value between 0 and 1 */
        show_title: true,
        /* true/false */
        allow_resize: true,
        /* Resize the photos bigger than viewport. true/false */
        default_width: 500,
        default_height: 344,
        counter_separator_label: '/',
        /* The separator for the gallery counter 1 "of" 2 */
        theme: 'pp_default',
        /* light_rounded / dark_rounded / light_square / dark_square / facebook */
        hideflash: false,
        /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
        wmode: 'opaque',
        /* Set the flash wmode attribute */
        autoplay: true,
        /* Automatically start videos: True/False */
        modal: false,
        /* If set to true, only the close button will close the window */
        overlay_gallery: false,
        /* If set to true, a gallery will overlay the fullscreen image on mouse over */
        keyboard_shortcuts: true,
        /* Set to false if you open forms inside prettyPhoto */
        deeplinking: false,
        social_tools: false
    });


    //Fix for portfolio work item text
    jQuery("#container .element, .image_slider li").each(function() {
        var work_items_element_holder_height = jQuery(this).height();
        var work_items_text_height = jQuery(this).find(".work_item_text").height();
        var work_items_top = (work_items_element_holder_height - work_items_text_height) / 2;
        jQuery(this).find(".work_item_text").css({
            'top': work_items_top
        });
        jQuery(this).find('a.preview').height(work_items_element_holder_height).hide();
    });



    //Portfolio hover and Slider image hover
    jQuery('#container .element, .image_slider li').hover(function() {
        jQuery(this).find('a.preview').fadeIn();
    }, function() {
        jQuery(this).find('a.preview').fadeOut();
    });


    //Member change color on hover
    jQuery('.member-holder').hover(function() {
        jQuery(this).find('.coloured').animate({
            opacity: 0.75
        });
    }, function() {
        jQuery(this).find('.coloured').animate({
            opacity: 0
        });
    });


    //Social hover
    jQuery('.team-social a').hover(function() {
        jQuery(this).find('img').css({
            'margin-top': '-25px'
        });
    }, function() {
        jQuery(this).find('img').css({
            'margin-top': '0px'
        });
    });

/*
    //Big Social hover
    jQuery('.big-social a').hover(function() {
        jQuery(this).find('img').css({
            'margin-top': '-54px'
        });
    }, function() {
        jQuery(this).find('img').css({
            'margin-top': '0px'
        });
    });
*/

    //Fix for background slider pagination
    jQuery('#slide-list').css({
        'top': (jQuery('#supersized').height() - 80),
        'left': "50%",
        "margin-left": (0 - jQuery("#slide-list").width() / 2)
    });

    //Fix for pricing button
    jQuery(".pricing-button").each(function() {
        jQuery(this).css({
            "margin-left": (0 - jQuery(this).width() / 2),
            "left": "50%"
        });
    });


    //Show-hide small menu
    jQuery(".small-menu-logo").click(function() {
        jQuery(this).next('ul').toggle();
    });

    //Close small menu after select page
    jQuery(".small-menu-background ul li a").click(function() {
        jQuery(".small-menu-logo").next('ul').toggle();
    });

    jQuery('.doc-loader').fadeOut('fast');

});


jQuery(window).resize(function() {

    // Fix for Vimeo and YouTube Video to be Full Screen
    jQuery(".vimeo, .youtube").each(function() {
        var vimeo_width = jQuery(this).width();
        var vimeo_height = vimeo_width * 16 * 7 / (90 * 2.2);
        jQuery(this).find('iframe').css('height', vimeo_height);
    });

    commentFormWidthFix();


    //Fix for background slider pagination
    jQuery('#slide-list').css({
        'top': (jQuery('#supersized').height() - 80),
        'left': "50%",
        "margin-left": (0 - jQuery("#slide-list").width() / 2)
    });

    //Fix for portfolio work item text
    jQuery('a.preview').show().css('opacity', '0');
    jQuery("#container .element, .image_slider li").each(function() {
        var work_items_element_holder_height = jQuery(this).height();
        var work_items_text_height = jQuery(this).find(".work_item_text").height();
        var work_items_top = (work_items_element_holder_height - work_items_text_height) / 2;
        jQuery(this).find(".work_item_text").css({
            'top': work_items_top
        });

        jQuery(this).find('a.preview').height(work_items_element_holder_height).hide().css('opacity', '0.75');
    });

    //Fix for pricing button
    jQuery(".pricing-button").each(function() {
        jQuery(this).css({
            "margin-left": (0 - jQuery(this).width() / 2),
            "left": "50%"
        });
    });

    //Fix for slider pagination
    if (jQuery(document).width() < 840) {
        jQuery('.slider_holder').each(function() {
            var pagination_width = jQuery(this).find('.carousel_pagination').first().width();
            var windw_width = jQuery(this).width();
            jQuery(this).find('.carousel_pagination').first().css("margin-left", (windw_width - pagination_width) / 2);
        });
    } else {
        jQuery('.carousel_pagination').css("margin-left", "160px");
    }


    //Isotope
    var $container = $('#container');

    $container.isotope({
        getSortData: {
            category: function($elem) {
                return $elem.attr('data-category');
            }
        },
        animationEngine: 'jquery'
    });


    //Set home section to be always full screen
    //
    jQuery(".home").height(jQuery(window).height() - 150);



});

//------------------------------------------------------------------------
//Helper Methods -->
//------------------------------------------------------------------------
var displayHints = function() {
}
var StringFormat = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var regExpression = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(regExpression, arguments[i + 1]);
    }
    return s;
}

var ResetInput = function() {
    jQuery('input, textarea').each(function() {
        jQuery(this).val('').text('');
    });
};

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var SendMail = function() {
    var isValid = true;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var formEmail = jQuery('#email').val();
    if (!emailReg.test(formEmail) || formEmail == "") {
        isValid = false;
        alert('Your email is not in valid format');
    }

    var formName = jQuery('#name').val();
    if (formName == 'Name') {
        isValid = false;
        alert('You must enter a name.');
    }

    var formSchool = jQuery('#school').val();
    if (formSchool == 'School') {
        isValid = false;
        alert('You must enter a school.');
    }

    var verify = makeid();

    if (isValid) {

        // Submit to Parse
        var Register = Parse.Object.extend("Register");
        var register = new Register();

        register.save({
            name: formName,
            email: formEmail,
            school: formSchool,
            emailVerify: verify
        }, {
            success: function(object) {
                // TODO Make confirm thing here blah
                alert("Thanks! You'll receive an email in a few weeks with further information.");



            },
            error: function(model, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
        /*
        var params = {
            'action': 'SendMessage',
            'name': formName,
            'email': formEmail,
            'token': verify,
            'subject': 'Youve registered to HackFSU!',
            'message': 'Test'
        };

        jQuery.ajax({
            type: "POST",
            url: "php/mainHandler.php",
            data: params,
            success: function(response) {
                if (response) {
                    var responseObj = jQuery.parseJSON(response);
                    if (responseObj.ResponseData) {
                        alert(responseObj.ResponseData);
                    }
                }

                displayHints();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //xhr.status : 404, 303, 501...
                var error = null;
                switch (xhr.status) {
                    case "301":
                        error = "Redirection Error!";
                        break;
                    case "307":
                        error = "Error, temporary server redirection!";
                        break;
                    case "400":
                        error = "Bad request!";
                        break;
                    case "404":
                        error = "Page not found!";
                        break;
                    case "500":
                        error = "Server is currently unavailable!";
                        break;
                    default:
                        error = "Unespected error, please try again later.";
                }
                if (error) {
                    alert(error);
                }
            }
        });*/
    }
};

var commentFormWidthFix = function() {
    jQuery('#submit-name, #submit-email, #submit-website, #submit-message').innerWidth(jQuery('.content-630').width());
};

function is_touch_device() {
    return !!('ontouchstart' in window);
}
