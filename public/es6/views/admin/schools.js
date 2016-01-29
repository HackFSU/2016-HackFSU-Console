/**
 * Manages school data for /admin/schools
 * Generates columns dynamically from the data
 */

(function() {
	'use strict';

	let viewTable = $('table#view');
	let viewHeader = viewTable.find('thead tr');

	getData()
	.then(parseData)
	.then(initializeTable)
	.catch(function(error) {
		console.error(error);
		alert('Error grabbing data! Check console for details');
	});

	function initializeTable(data) {
		// make header
		data.columns.forEach(function(col) {
			viewHeader.append(`<th>${col.name}</th>`);
		});

		viewTable.DataTable({
			data: data.schools,
			scrollX: true,
			columns: data.columns,
			order: [[0, 'desc']],
			aLengthMenu: [
				[25, 50, 100, 200, -1],
				[25, 50, 100, 200, 'All']
			],
			iDisplayLength: 25,
			dom: '<"view-top"<"col-sm-6"l><"col-sm-6"fBr>><"view-table"t><"view-bottom"<"col-sm-6"i><"col-sm-6"p>>',
			buttons: ['excel']
		});

		let viewTop = $('.view-top');

		// style excel button
		viewTop.find('a.buttons-excel')
			.removeClass('btn-default')
			.addClass('btn-success')
			.find('span').text('Export Excel');


		$('#loadingMessage').remove();

		return Promise.resolve();
	}


	function getData() {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'GET',
				url: '/admin/schools/data',
				success: function(res) {
					if(res.error) {
						reject(res.error);
					}
					resolve(res.data);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	}

	/**
	 * Grabs column data from the data
	 */
	function parseData(schools) {
		let columns = [
			{ name: 'Count', data: 'count' },
			{ name: 'School', data: 'name' }
		];

		// Make a column for each status. Every school should have counts for all
		if(schools.length > 0) {
			// just grab them all from the first school
			let school = schools[0];

			for(let status in school.statuses) {
				if(school.statuses.hasOwnProperty(status)) {
					columns.push({
						name: status,
						data: 'statuses.' + status
					});
				}
			}
		}

		return Promise.resolve({
			columns: columns,
			schools: schools
		});
	}


})();
