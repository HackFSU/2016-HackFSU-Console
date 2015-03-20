// Generated by CoffeeScript 1.8.0

/*
'/help'

Handles form submission.

Dependencies:
	jQuery
 */

(function() {
  var displayEnd, endInError, endInSuccess, validate;

  $('#helpForm').submit(function(event) {
    var obj, val;
    event.preventDefault();
    obj = {
      name: $('#name').val(),
      location: $('#location').val(),
      description: $('#description').val()
    };
    val = validate(obj);
    console.log('FORM: ' + JSON.stringify(obj, void 0, 2));
    $('label').removeClass('hasInputError');
    $('.form-error-msg').text('');
    if (val !== true) {
      $('label[for="' + val["for"] + '"]').addClass('hasInputError');
      $('.form-error-msg').text(val.msg);
      $('#submit').shakeIt();
    } else {
      $('#submit').text('Submitting...');
      $.ajax({
        type: 'post',
        url: '/help_submit',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        success: function(res) {
          if (res.success === true) {
            return endInSuccess();
          } else {
            return endInError();
          }
        },
        error: function() {
          return endInError();
        }
      });
    }
  });

  validate = function(obj) {
    if (!obj.name.trim()) {
      return {
        "for": 'name',
        msg: 'Missing name!'
      };
    } else if (!obj.location.trim()) {
      return {
        "for": 'location',
        msg: 'Missing location!'
      };
    } else if (!obj.description.trim()) {
      return {
        "for": 'description',
        msg: 'Missing description!'
      };
    }
    return true;
  };

  endInError = function() {
    var sub;
    sub = $('#submit');
    return sub.fadeOut(500, function() {
      sub.text('Error!');
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
      return displayEnd("A mentor should be coming your way shortly!", "If you don't hear from anyone in the next ten minutes, just head over to the mentor area or ask an organizer.");
    });
  };

  displayEnd = function(header, subtext) {
    $('input').attr('disabled', 'disabled');
    $('checkbox').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
    return $('#helpForm').fadeTo(1000, 0, function() {
      var $newMsg;
      $newMsg = $("<div id='endDisplay'><h3>" + header + "</h3><h4>" + subtext + "</h4>");
      $newMsg.appendTo($('.form-result')).fadeIn(1000, function() {
        return $("html, body").animate({
          scrollTop: 0
        }, 500);
      });
    });
  };

}).call(this);
