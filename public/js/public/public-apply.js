// Generated by CoffeeScript 1.10.0

/*
	Handles submission of application for /apply

	Dependencies:
		JQuery
	IDs
		-match parse ids except for QAs
		QA[0-5]
 */


/*
 * Invalid input visual feedback 
 * 	1. shake submit btn
 * 	2. make error red
 */


/*
 * Handle form submission
 */

(function() {
  var checkAppData, displayEnd, endInError, endInSuccess;

  $('#application').submit(function(event) {
    var appData, appValid;
    event.preventDefault();
    appData = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#email').val(),
      school: $('#school').val(),
      major: $('#major').val(),
      year: $('#year').val(),
      github: $('#github').val(),
      QAs: [$('input[type=radio][name=QA0][value=Yes]').is(':checked'), $('#QA1').val(), [$('#ios').is(':checked'), $('#android').is(':checked'), $('#web').is(':checked'), $('#front').is(':checked'), $('#back').is(':checked'), $('#shelf').is(':checked'), $('#micro').is(':checked')], $('#QA3').val(), $('#QA4').val()]
    };
    console.log(JSON.stringify(appData));
    appValid = checkAppData(appData);
    if (appValid !== true) {
      $('label[for=' + appValid["for"] + ']').addClass('hasInputError');
      $('.form-error-msg').text(appValid.msg);
      if (appValid["for"] === 'year') {
        $('select[name=' + appValid["for"] + ']').change(function() {
          $('label[for=' + $(this).attr('name') + ']').removeClass('hasInputError');
          return $('.form-error-msg').text("");
        });
      } else {
        $('input[name=' + appValid["for"] + ']').change(function() {
          $('label[for=' + $(this).attr('name') + ']').removeClass('hasInputError');
          return $('.form-error-msg').text("");
        });
      }
      $('#submit').shakeIt();
    } else {
      $('#submit').text('Submitting...');
      if (appValid === true) {
        $.ajax({
          type: 'POST',
          url: '/apply_submit',
          data: JSON.stringify(appData),
          contentType: 'application/json',
          success: function(res) {
            console.log(JSON.stringify(res, void 0, 2));
            if (res.appValid) {
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
    }
    console.log(appValid);
  });

  endInError = function() {
    var sub;
    sub = $('#submit');
    sub.fadeOut(500, function() {
      sub.text('Error!');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      return displayEnd("An unexpected error has occured!", "Refresh this window and try resubmitting your application.");
    });
  };

  endInSuccess = function() {
    var sub;
    sub = $('#submit');
    sub.fadeOut(500, function() {
      sub.text('Success!');
      sub.attr('disabled', 'true');
      sub.fadeIn(500, function() {});
      return displayEnd("Thanks for applying!", "You should be receiving a confirmation email soon.");
    });
  };

  displayEnd = function(header, subtext) {
    $('input').attr('disabled', 'disabled');
    $('checkbox').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
    $('#application').fadeTo(1000, 0, function() {
      var $newMsg;
      $newMsg = $("<div id='endDisplay'><h3>" + header + "</h3><h4>" + subtext + "</h4>");
      $newMsg.appendTo($('.formResult')).fadeIn(1000, function() {
        return $("html, body").animate({
          scrollTop: 0
        }, 500);
      });
    });
  };


  /*
   * Checks appdata for correct input. Returns true for valid,
   * or the form number for the first incorrect input (goes top down from 0)
   */

  checkAppData = function(appData) {
    var re;
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!appData.firstName.trim()) {
      return {
        "for": "firstName",
        msg: "Missing first name!"
      };
    }
    if (!appData.lastName.trim()) {
      return {
        "for": "lastName",
        msg: "Missing last name!"
      };
    }
    if (!appData.school.trim()) {
      return {
        "for": "school",
        msg: "Missing school!"
      };
    }
    if (!appData.email.trim()) {
      return {
        "for": "email",
        msg: "Missing email!"
      };
    }
    if (!re.test(appData.email)) {
      return {
        "for": "email",
        msg: "Valid email required!"
      };
    }
    if (!appData.year) {
      return {
        "for": "year",
        msg: "Missing year!"
      };
    }
    if (!(appData.QAs[0] || $('input[type=radio][name=QA0][value=No]').is(':checked'))) {
      return {
        "for": "QA0",
        msg: "Missing question #0!'"
      };
    }
    return true;
  };

}).call(this);
