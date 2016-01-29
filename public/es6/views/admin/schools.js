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
		iDisplayLength: 25
	});




})();
