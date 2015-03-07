// Generated by CoffeeScript 1.9.1

/*
'/mentor'

Handles form submission.

Dependencies:
	jQuery
 */

(function() {
  var displayEnd, endInError, endInSuccess, validate;

  $('#mentorForm').submit(function(event) {
    var obj, val;
    event.preventDefault();
    obj = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#email').val(),
      affiliation: $('#affiliation').val(),
      skills: $('#skills').val(),
      phoneNumber: $('#phoneNumber').val(),
      times: [$('#sat-midnight-morning').is(':checked'), $('#sat-morning-midday').is(':checked'), $('#sat-midday-evening').is(':checked'), $('#sat-evening-midnight').is(':checked'), $('#sun-midnight-morning').is(':checked')]
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
        url: '/mentor_submit',
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
    var i, j, len, pn, regE, regP;
    regE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    regP = /\d/g;
    pn = obj.phoneNumber.match(regP);
    if (!obj.firstName.trim()) {
      return {
        "for": 'firstName',
        msg: 'Missing first name!'
      };
    } else if (!obj.lastName.trim()) {
      return {
        "for": 'lastName',
        msg: 'Missing last name!'
      };
    } else if (!obj.email.trim()) {
      return {
        "for": 'email',
        msg: 'Missing email!'
      };
    } else if (!regE.test(obj.email)) {
      return {
        "for": 'email',
        msg: 'Valid email required!'
      };
    } else if (!obj.phoneNumber.trim()) {
      return {
        "for": 'phoneNumber',
        msg: 'Missing phone number!'
      };
    } else if (pn == null) {
      return {
        "for": 'phoneNumber',
        msg: 'Full 10-digit phone number required!'
      };
    } else if (pn.length !== 10) {
      return {
        "for": 'phoneNumber',
        msg: 'Full 10-digit phone number required!'
      };
    } else if (!obj.affiliation.trim()) {
      return {
        "for": 'affiliation',
        msg: 'Missing affiliation!'
      };
    } else if (!obj.skills.trim()) {
      return {
        "for": 'skills',
        msg: 'Missing skills!'
      };
    } else if (!obj.times[0] && !obj.times[1] && !obj.times[2] && !obj.times[3] && !obj.times[4]) {
      return {
        "for": 'times',
        msg: 'At least one available time is required.'
      };
    }
    obj.phoneNumber = "";
    for (j = 0, len = pn.length; j < len; j++) {
      i = pn[j];
      obj.phoneNumber += i;
    }
    obj.phoneNumber = parseInt(obj.phoneNumber);
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
      return displayEnd("Thanks for mentoring!", "You should be receiving a confirmation email soon.");
    });
  };

  displayEnd = function(header, subtext) {
    $('input').attr('disabled', 'disabled');
    $('checkbox').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
    return $('#mentorForm').fadeTo(1000, 0, function() {
      var $newMsg;
      $newMsg = $("<div id='endDisplay'><h3>" + header + "</h3><h4>" + subtext + "</h4>");
      $newMsg.appendTo($('.sponsor-blurb')).fadeIn(1000, function() {
        return $("html, body").animate({
          scrollTop: 0
        }, 500);
      });
    });
  };

}).call(this);
