// Generated by CoffeeScript 1.8.0

/*
For application confirmation page /confirm/:cid
 */

(function() {
  var FADE_TIME, displayEnd, endInError, endInSuccess, formData, validateForm;

  FADE_TIME = 100;

  jQuery.fn.overlayFit = function() {
    return $(this).find('.overlay-img').css({
      height: $(this).height(),
      width: $(this).width(),
      top: $(this).offset().top,
      left: $(this).offset().left
    });
  };

  jQuery.fn.overlayOn = function() {
    $(this).overlayFit();
    $(this).find('.overlay-img').fadeTo(FADE_TIME, .75);
    return $(this).find('.overlay-img').css({
      'z-index': 100
    });
  };

  jQuery.fn.overlayOff = function() {
    $(this).find('.overlay-img').fadeTo(FADE_TIME, 0);
    return $(this).find('.overlay-img').css({
      'z-index': -100
    });
  };

  $(window).resize(function() {
    return $('.overlay-container').overlayFit();
  });

  $('#going-y').change(function() {
    if ($(this).is(':checked')) {
      return $('.overlay-container').overlayOff();
    }
  });

  $('#going-n').change(function() {
    if ($(this).is(':checked')) {
      return $('.overlay-container').overlayOn();
    }
  });

  formData = null;

  $('#confirmForm').submit(function(event) {
    var formValid;
    event.preventDefault();
    formData = {
      confirmationId: $('#confirmationId').val(),
      going: $('input[type=radio][name=going]:checked').val(),
      phoneNumber: $('#phoneNumber').val(),
      tshirt: $('input[type=radio][name=tshirt]:checked').val(),
      specialNeeds: $('#specialNeeds').val(),
      resume: null,
      gender: $('input[type=radio][name=gender]:checked').val(),
      bday: $('#bday').val(),
      diet: $('#diet').val(),
      comments: $('#comments').val(),
      agreement: $('input[type=checkbox][name=agreement]').is(':checked'),
      under18: $('input[type=radio][name=under18]:checked').val()
    };
    if (formData.going === 'Yes') {
      formData.going = true;
    } else if (formData.going === 'No') {
      formData.going = false;
    } else {
      formData.going = null;
    }
    if (formData.under18 === 'Yes') {
      formData.under18 = true;
    } else if (formData.under18 === 'No') {
      formData.under18 = false;
    } else {
      formData.under18 = null;
    }
    console.log('PRE-CHECK: ' + JSON.stringify(formData));
    formValid = validateForm(formData);
    console.log('POST-CHECK: ' + JSON.stringify(formData));
    if (formValid !== true) {
      $('label[for=' + formValid["for"] + ']').addClass('hasInputError');
      $('.form-error-msg').text(formValid.msg);
      if (formValid["for"] === 'year') {
        $('select[name=' + formValid["for"] + ']').change(function() {
          $('label[for=' + $(this).attr('name') + ']').removeClass('hasInputError');
          return $('.form-error-msg').text("");
        });
      } else {
        $('input[name=' + formValid["for"] + ']').change(function() {
          $('label[for=' + $(this).attr('name') + ']').removeClass('hasInputError');
          return $('.form-error-msg').text("");
        });
      }
      $('#submit').shakeIt();
    } else {
      $('#submit').text('Submitting...');
      console.log('rawr');
      $.ajax({
        type: 'POST',
        url: '/confirm_submit',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function(res) {
          console.log(JSON.stringify(res, void 0, 2));
          if (res.success) {
            return endInSuccess();
          } else {
            endInError();
          }
        },
        error: function() {
          endInError();
        }
      });
    }
    console.log(formValid);
  });

  endInError = function() {
    var sub;
    sub = $('#submit');
    sub.fadeOut(500, function() {
      sub.text('Error!');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      return displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting your confirmation.");
    });
  };

  endInSuccess = function() {
    var sub;
    sub = $('#submit');
    sub.fadeOut(500, function() {
      sub.text('Success!');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      if (formData.going) {
        return displayEnd("See you soon!", "If you need a group, go check out our facebook <a class='link-text' href='http://www.facebook.com/groups/622705054530502/'>attendees page</a>!");
      } else {
        return displayEnd("Sorry to hear that you are not going!", "Your spot will be opened up for another hacker.");
      }
    });
  };

  displayEnd = function(header, subtext) {
    $('input').attr('disabled', 'disabled');
    $('checkbox').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
    $('#confirmForm').fadeTo(1000, 0, function() {
      var $newMsg;
      $newMsg = $("<div id='endDisplay'><h3>" + header + "</h3><h4>" + subtext + "</h4>");
      $newMsg.appendTo($('.formResult')).fadeIn(1000, function() {
        return $("html, body").animate({
          scrollTop: 0
        }, 500);
      });
    });
  };

  validateForm = function(obj) {
    var bd, i, pn, regB, regP, _i, _len;
    regP = /\d/g;
    regB = '^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d$';
    pn = obj.phoneNumber.match(regP);
    if (obj.going === null) {
      return {
        "for": 'going',
        msg: 'You must decide if you are going!'
      };
    } else if (obj.going) {
      if (!obj.phoneNumber || !obj.phoneNumber.trim()) {
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
      } else if (obj.tshirt == null) {
        return {
          "for": 'tshirt',
          msg: 'You must chose a t-shirt size!'
        };
      } else if (obj.under18 == null) {
        return {
          "for": 'under18',
          msg: 'Are you under 18 years old?'
        };
      } else if (!obj.agreement) {
        return {
          "for": 'agreement',
          msg: 'You must read and agree to the MLH Code of Conduct and the Medical Waiver!'
        };
      }
      console.log("BDAY:'" + obj.bday + "'");
      if (obj.bday) {
        obj.bday = obj.bday.trim();
        bd = obj.bday.match(regB);
        if (bd == null) {
          return {
            "for": 'bday',
            msg: 'Valid birthdate in mm/dd/yyyy format only!'
          };
        }
      } else {
        obj.bday = null;
      }
      if (!obj.specialNeeds) {
        obj.specialNeeds = null;
      }
      if (!(obj.gender === 'male' | obj.gender === 'female' | obj.gender === 'other')) {
        obj.gender = null;
      }
      if (!obj.diet) {
        obj.diet = null;
      }
      if (!obj.comments) {
        obj.comments = null;
      }
      obj.phoneNumber = "";
      for (_i = 0, _len = pn.length; _i < _len; _i++) {
        i = pn[_i];
        obj.phoneNumber += i;
      }
      obj.phoneNumber = parseInt(obj.phoneNumber);
    }
    return true;
  };

  $('.hidden-container').hover(function() {
    $(this).find('.hidden-text').fadeTo(FADE_TIME, .75);
  }, function() {
    $(this).find('.hidden-text').fadeTo(FADE_TIME, 0);
  });

}).call(this);
