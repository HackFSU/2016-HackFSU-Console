// Generated by CoffeeScript 1.8.0

/*
For: /admin/applications
 */
var currTab, tabHtml;

tabHtml = {
  schools: $('#schools').wrap('<p/>').parent().html(),
  all: $('#all').wrap('<p/>').parent().html()
};

$('#schools').unwrap();

$('#all').unwrap().remove();

currTab = 0;

$('a[role="tab"][href="#schools"]').click(function(e) {
  e.preventDefault();
  console.log('clicked school');
  if (currTab !== 0) {
    $('#all').remove();
    $('#tabContainer').append(tabHtml.schools);
    currTab = 0;
  }
  return $(this).tab('show');
});

$('a[role="tab"][href="#all"]').click(function(e) {
  e.preventDefault();
  console.log('clicked all');
  if (currTab !== 1) {
    $('#schools').remove();
    $('#tabContainer').append(tabHtml.all);
    currTab = 1;
  }
  return $(this).tab('show');
});
