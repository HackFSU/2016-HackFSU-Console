(function($) {
	'use strict';

	$(document).ready(function() {

    let url_parts = location.href.split('/');

    let last_segment = url_parts[url_parts.length-1];

    $('a[href="/' + last_segment + '"]').parents('li').addClass('active');
  });
})(jQuery);
