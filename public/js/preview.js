/*
Handles preview form submission

Dependencies:
	jQuery
 */

(function() {
  var displayEnd, endInError, endInSuccess, validate;

  $('#submit-successful').hide()

  $('#previewEmailSubscribe').submit(function(event) {
    var obj, val;
    event.preventDefault();
    obj = {
      email: $('#email').val(),
    };
    val = validate(obj);
    console.log('FORM: ' + JSON.stringify(obj, void 0, 2));

    if (val !== true) {
      $('label[for="' + val["for"] + '"]').addClass('hasInputError');
      $('.form-error-msg').text(val.msg);
      $('#submit').shakeIt();
    } else {
      $('#submit').text('Submitting...');
      $.ajax({
        type: 'post',
        url: '/subscribe',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        success: function(res) {
          if (res.success === true) {
            return endInSuccess();
          } else {
            return endInError(0);
          }
        },
        error: function() {
          return endInError(1);
        }
      });
    }
  });

  validate = function(obj) {
      return true;
  };

  endInError = function(err) {
    var sub;
    sub = $('#submit');
    return sub.fadeOut(500, function() {
      sub.text(err === 0 ? 'L1' : 'L2');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      return displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting.");
    });
  };

  endInSuccess = function() {
    var sub;
    sub = $('#submit');
    return sub.fadeOut(500, function() {
      sub.text('Success!');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      return displayEnd("Thanks! We will let you know when registration opens and we cannot wait to see you this Spring! In the meantime, check us out on Twitter for other updates.");
    });
  };

    displayEnd = function(header) {
        $('input').attr('disabled', 'disabled');
        $('checkbox').attr('disabled', 'disabled');
        $('select').attr('disabled', 'disabled');
        return $('#preview-content').fadeTo(1000, 0, function() {
            $('#preview-content').remove();
            $('#submit-successful').append('<p id="description-text>"' + header + '</p>').fadeIn(1000, function() {
                return $("html, body").animate({
                    scrollTop: 0
                }, 500);
            });
        });
    };
}).call(this);
