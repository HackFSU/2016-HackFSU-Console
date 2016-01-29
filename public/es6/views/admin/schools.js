/**
 * Manages school data for /admin/schools
 */

(function() {
	'use strict';

	let viewTable = $('table#view');
	let viewHeader = viewTable.find('thead tr');
	let columns = [
		'Count',
		'School'
	];

	// make header
	columns.forEach(function(name, i) {
		viewHeader.append(`<th>${name}</th>`);
	});

	viewTable.DataTable({
		ajax: '/admin/schools/data',
		scrollX: true,
		columns: [
			{ data: 'count' },
			{ data: 'value' }
		],
		order: [[0, 'desc']],
		aLengthMenu: [
			[25, 50, 100, 200, -1],
			[25, 50, 100, 200, 'All']
		],
		iDisplayLength: 25,
		dom: '<"view-top"<"col-sm-6"l><"col-sm-6"fBr>><"view-table"t><"view-bottom"ip>',
		buttons: ['excel']
	});

	let viewTop = $('.view-top');

	// style excel button
	viewTop.find('a.buttons-excel')
		.removeClass('btn-default')
		.addClass('btn-success')
		.find('span').text('Export Excel');


})();
