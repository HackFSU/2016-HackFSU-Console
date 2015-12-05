(function () {

// ## getData
// Gets data out of form and returns it
function getData () {
  return $('#regform').serializeArray().reduce(function (memo, item) {

    // Skillset should be an array
    if (item.name == "skillset") memo.skillset.push(item.value);
    else memo[item.name] = item.value;

    return memo;
  }, {skillset: []});
}

var oldregtext = $('#submitbtn').html();

function register () {
  Parse.initialize("4NDzxeC8KxdZi4Kyok7QfGhtS27GuHfntNh9ZSfL", "O0orh0DoOffqBmmtkWG1eWgZxXHiHYHOsH6x57cU");

  $('#submitbtn').attr('disabled', true);
  $('#submitbtn').html('Registering ...');

  var user = new Parse.User();
  var data = getData();

  if (data.passwordconfirm != data.password) {
    $('#submitbtn').attr('disabled', false);
    $('#submitbtn').html(oldregtext);
    return alert("Passwords do not match!");
  }

  delete data.passwordconfirm;
  for (var i in data) user.set(i, data[i]);

  function __doSignup (resumeFile) {
    if (resumeFile) user.set('resume', resumeFile);

    user.signUp().then(function () {
      alert("You're now on the waitlist!", "http://hackfsu.com");

      $('#submitbtn').attr('disabled', false);
      $('#submitbtn').html(oldregtext);
    }, function (error) {
      alert(error.message);

      $('#submitbtn').attr('disabled', false);
      $('#submitbtn').html(oldregtext);
    });
  }

  var filecontrol = $('#upfile')[0];
  var filename = $('#upfile').value;
  var parseFile;

  try {

    if (filecontrol.files.length > 0) {
      var file = filecontrol.files[0];
      var name = data.name.replace(/ /g, '') + "_resume";

      var parts = file.name.split('.');
      var ext = parts[parts.length - 1].toUpperCase();
      if (ext !== "PDF") {
        $('#submitbtn').attr('disabled', false);
        $('#submitbtn').html(oldregtext);
        return alert("Resume must be .pdf file");
      }

      parseFile = new Parse.File(name, file);
    }

  } catch (e) { 
    /* do nothing if the file shit doesnt work */
  } finally {
  }

  __doSignup(parseFile);
}

$('#regform').on('submit', function (e) {
  e.preventDefault();

  register();
});

window.getData = getData;
window.register = register;

var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
alert = function (stuff, redirect) {
  $('#remodal p').html(stuff);
  inst.open();

  if (redirect) {
    $(document).on('closed', '.remodal', function () {
      window.location = redirect;
    });
  }
};

}());
