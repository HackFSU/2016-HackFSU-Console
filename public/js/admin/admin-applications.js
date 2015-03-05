// Generated by CoffeeScript 1.8.0

/*
For: /admin/applications
 */

(function() {
  var FADE_TIME, REFRESH_SPEED, STATUS_ACCEPTED, STATUS_GOING, STATUS_NOT_GOING, STATUS_PENDING, STATUS_WAITLISTED, accept, dtSettings_QAs, dtSettings_all, dtSettings_schools, refreshStatusCounts, waitlist;

  FADE_TIME = 100;

  dtSettings_schools = {
    order: [[2, 'desc']],
    aLengthMenu: [[25, 50, 75, -1], [25, 50, 75, "All"]],
    iDisplayLength: 25,
    autoWidth: true
  };

  dtSettings_all = {
    order: [[0, 'asc']],
    aLengthMenu: [[50, 100, 200, 300, -1], [50, 100, 200, 300, "All"]],
    iDisplayLength: 50,
    autoWidth: true,
    columnDefs: [
      {
        width: '50px',
        targets: 6
      }
    ]
  };

  dtSettings_QAs = [
    {
      order: [[0, 'asc']],
      aLengthMenu: [[50, 100, 200, 300, -1], [50, 100, 200, 300, "All"]],
      iDisplayLength: 50,
      autoWidth: true
    }
  ];

  dtSettings_QAs.push(dtSettings_QAs[0]);

  dtSettings_QAs.push(dtSettings_QAs[0]);

  dtSettings_QAs.push(dtSettings_QAs[0]);

  dtSettings_QAs.push(dtSettings_QAs[0]);

  $(document).ready(function() {
    var currTab, refreshTabs, tabHtml;
    currTab = [0, 0];
    tabHtml = {
      schools: $('#schools').wrap('<p/>').parent().html(),
      all: $('#all').wrap('<p/>').parent().html(),
      QAs: [void 0, $('#QA1').wrap('<p/>').parent().html(), $('#QA2').wrap('<p/>').parent().html(), $('#QA3').wrap('<p/>').parent().html(), $('#QA4').wrap('<p/>').parent().html()]
    };
    $('#tabContainer1').empty();
    tabHtml.QAs[0] = $('#QAs').wrap('<p/>').parent().html();
    $('#QAs').unwrap().remove();
    $('#tabContainer0').empty();
    $('#tabContainer0').append(tabHtml.schools);
    $('#DT-schools').DataTable(dtSettings_schools);
    refreshTabs = function() {
      $('a[role="tab"]').click(function(e) {
        var href;
        e.preventDefault();
        href = $(this).attr('href');
        switch (href) {
          case '#schools':
            if (currTab[0] !== 0) {
              $('#tabContainer0').empty();
              $('#tabContainer0').append(tabHtml.schools);
              $('#DT-schools').DataTable(dtSettings_schools);
              return currTab[0] = 0;
            }
            break;
          case '#all':
            if (currTab[0] !== 1) {
              $('#tabContainer0').empty();
              $('#tabContainer0').append(tabHtml.all);
              $('button[name="accept"]').click(function() {
                accept($(this), $(this).attr('data-objectId'), $(this).attr('data-status'));
              });
              $('button[name="waitlist"]').click(function() {
                waitlist($(this), $(this).attr('data-objectId'), $(this).attr('data-status'));
              });
              $('#DT-all').DataTable(dtSettings_all);
              return currTab[0] = 1;
            }
            break;
          case '#QAs':
            if (currTab[0] !== 2) {
              $('#tabContainer0').empty();
              $('#tabContainer0').append(tabHtml.QAs[0]);
              $('#tabContainer1').empty();
              $('#tabContainer1').append(tabHtml.QAs[1]);
              $('#DT-QA1').DataTable(dtSettings_QAs[1]);
              currTab[0] = 2;
              currTab[1] = 0;
              return refreshTabs();
            }
            break;
          case '#QA1':
            if (currTab[1] !== 0) {
              $('#tabContainer1').empty();
              $('#tabContainer1').append(tabHtml.QAs[1]);
              $('#DT-QA1').DataTable(dtSettings_QAs[1]);
              return currTab[1] = 0;
            }
            break;
          case '#QA2':
            if (currTab[1] !== 1) {
              $('#tabContainer1').empty();
              $('#tabContainer1').append(tabHtml.QAs[2]);
              $('#DT-QA2').DataTable(dtSettings_QAs[2]);
              return currTab[1] = 1;
            }
            break;
          case '#QA3':
            if (currTab[1] !== 2) {
              $('#tabContainer1').empty();
              $('#tabContainer1').append(tabHtml.QAs[3]);
              $('#DT-QA3').DataTable(dtSettings_QAs[2]);
              return currTab[1] = 2;
            }
            break;
          case '#QA4':
            if (currTab[1] !== 3) {
              $('#tabContainer1').empty();
              $('#tabContainer1').append(tabHtml.QAs[4]);
              $('#DT-QA4').DataTable(dtSettings_QAs[4]);
              return currTab[1] = 3;
            }
            break;
          default:
            return console.log('Invalid tab id');
        }
      });
      return $(this).tab('show');
    };
    return refreshTabs();
  });

  STATUS_PENDING = 'pending';

  STATUS_WAITLISTED = 'waitlisted';

  STATUS_ACCEPTED = 'accepted';

  STATUS_GOING = 'going';

  STATUS_NOT_GOING = 'not going';

  accept = function($btn, objectId, status) {
    var good;
    $('button[data-objectId="' + objectId + '"]').attr('disabled', 'disabled');
    $btn.text('...');
    $('#loading img').fadeTo(FADE_TIME, 1);
    status = status === void 0 ? '' : status;
    good = false;
    if (status === STATUS_WAITLISTED) {
      if (confirm('This app was waitlisted, are you sure you want to accept them?')) {
        good = true;
      } else {
        $btn.text('accept');
        $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
        $('#loading img').fadeTo(FADE_TIME, 0);
        return;
      }
    } else if (status === STATUS_PENDING) {
      good = true;
    }
    if (good) {
      console.log('Accepting ' + objectId);
      return $.ajax({
        type: 'POST',
        url: '/admin/applications_action',
        data: JSON.stringify({
          action: 'accept',
          objectId: objectId
        }),
        contentType: 'application/json',
        success: function(res) {
          console.log(JSON.stringify(res, void 0, 2));
          if (res.success) {
            $btn.text('Done!');
          } else {
            $btn.text('Error!');
            $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
          }
          $('#loading img').fadeTo(FADE_TIME, 0);
        },
        error: function() {
          $btn.text('Error!');
          $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
          $('#loading img').fadeTo(FADE_TIME, 0);
        }
      });
    } else {
      console.log('Error! cannot accept ' + objectId + 'with status ' + status);
      $btn.text('Error!');
      return $('#loading img').fadeTo(FADE_TIME, 0);
    }
  };

  waitlist = function($btn, objectId, status) {
    $('button[data-objectId="' + objectId + '"]').attr('disabled', 'disabled');
    $btn.text('...');
    $('#loading img').fadeTo(FADE_TIME, 1);
    status = status === void 0 ? '' : status;
    if (status === STATUS_PENDING) {
      if (confirm('Are you sure you want to waitlist this person?')) {
        console.log('Waitlisting ' + objectId);
        return $.ajax({
          type: 'POST',
          url: '/admin/applications_action',
          data: JSON.stringify({
            action: 'waitlist',
            objectId: objectId
          }),
          contentType: 'application/json',
          success: function(res) {
            console.log(JSON.stringify(res, void 0, 2));
            if (res.success) {
              $btn.text('Done!');
            } else {
              $btn.text('Error!');
              $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
              return;
            }
            return $('#loading img').fadeTo(FADE_TIME, 0);
          },
          error: function() {
            $btn.text('Error!');
            $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
            $('#loading img').fadeTo(FADE_TIME, 0);
          }
        });
      } else {
        $btn.text('waitlist');
        $('button[data-objectId="' + objectId + '"]').removeAttr('disabled', 'disabled');
        return $('#loading img').fadeTo(FADE_TIME, 0);
      }
    } else {
      console.log('Error! cannot waitlist ' + objectId + 'with status ' + status);
      return $('#loading img').fadeTo(FADE_TIME, 0);
    }
  };

  REFRESH_SPEED = 60000;

  refreshStatusCounts = function() {
    console.log('Refreshing status counts...');
    $('#loading img').fadeTo(FADE_TIME, 1);
    return $.ajax({
      type: 'POST',
      url: '/admin/applications_getStatusCounts',
      data: JSON.stringify({}),
      contentType: 'application/json',
      success: function(res) {
        if (res.success) {
          $('#pending').text('PENDING  ' + res.counts.pending);
          $('#waitlisted').text('WAITLISTED  ' + res.counts.waitlisted);
          $('#accepted').text('ACCEPTED  ' + res.counts.accepted);
          $('#going').text('GOING  ' + res.counts.going);
          $('#notGoing').text('NOT GOING  ' + res.counts.notGoing);
        } else {
          console.log('Error counting status counts!');
          $('#pending').text('PENDING  ERR!');
          $('#waitlisted').text('WAITLISTED  ERR!');
          $('#accepted').text('ACCEPTED  ERR!');
          $('#going').text('GOING  ERR!');
          $('#notGoing').text('NOT GOING ERR!');
          return;
        }
        return $('#loading img').fadeTo(FADE_TIME, 0);
      },
      error: function() {
        console.log('Error retrieving status counts!');
        $('#pending').text('PENDING  ERR!');
        $('#waitlisted').text('WAITLISTED  ERR!');
        $('#accepted').text('ACCEPTED  ERR!');
        $('#going').text('GOING  ERR!');
        $('#notGoing').text('NOT  GOING ERR!');
        $('#loading img').fadeTo(FADE_TIME, 0);
      }
    });
  };

  setInterval(refreshStatusCounts(), REFRESH_SPEED);

}).call(this);
