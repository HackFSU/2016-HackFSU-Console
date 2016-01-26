'use strict';

(function ($) {
   'use strict';

   $(document).ready(function () {

      var url_parts = location.href.split('/');

      var last_segment = url_parts[url_parts.length - 1];

      $('a[href="/' + last_segment + '"]').parents('li').addClass('active');
   });
})(jQuery);
//# sourceMappingURL=navbar-active.js.map
