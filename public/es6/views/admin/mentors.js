/**
 * Manages mentor data for /admin/mentors
 */

(function() {
	'use strict';

	let viewTable = $('table#view');
	let viewHeader = viewTable.find('thead tr');
	let viewToggle = $('#view-toggle');
	let columns = {
		'First N': 'firstName',
		'Last N': 'lastName',

		'Email': 'email',
		'Phone': 'phone',

		'GitHub': 'github',

		'Affiliation': 'affiliation',
		'Availability': 'times',
		'Skills': 'skills',

		'First?': 'firstHackathon',
		'Shirt': 'shirtSize',

		'Diet': 'diet',
		'Comments': 'comments'
	};

	// make header
	Object.keys(columns).forEach(function(name, i) {
		viewHeader.append(`<th>${name}</th>`);
		viewToggle.append(`<div class="btn btn-primary btn-sm" data-col="${i}">${name}</div>`);
	});


	viewTable = viewTable.DataTable({
		ajax: getData,
		scrollX: true,
		columns: structureCols(columns),
		dom: '<"view-top"<"col-sm-6"l><"col-sm-6"fBr>><"view-table"t><"view-bottom"<"col-sm-6"i><"col-sm-6"p>>',
		buttons: ['excel'],
		aLengthMenu: [
			[25, 50, 100, 200, -1],
			[25, 50, 100, 200, 'All']
		],
	});

	viewToggle.children().click(function(e) {
		toggleCol($(this).data('col'));
	});

	let viewTop = $('.view-top');

	// style excel button
	viewTop.find('a.buttons-excel')
		.removeClass('btn-default')
		.addClass('btn-success')
		.find('span').text('Export Excel');


	function toggleCol(i) {
		let col = viewTable.column(i);
		let toggle = viewToggle.find(`[data-col="${i}"]`);

		col.visible(!col.visible());

		if(!col.visible()) {
			toggle.removeClass('btn-primary');
			toggle.addClass('btn-default');
		} else {
			toggle.addClass('btn-primary');
			toggle.removeClass('btn-default');
		}
	}

	function getData(data, cb) {
		$.ajax({
			method: 'GET',
			url: '/admin/mentors/list',
			success: function(res) {
				if(res.error) {
					console.error(res.error);
					cb({});
				}
				cb(preprocess(res.data));
			},
			error: function(error) {
				console.error(error);
				cb({});
			}
		});
	}

	function preprocess(data) {
		let finalRows = [];
		let newRow;
		data.forEach(function(rowData, i) {
			newRow = {
				firstName: rowData.user.firstName,
				lastName: rowData.user.lastName,
				github: rowData.user.github? rowData.user.github : '',
				phone: rowData.user.phone? rowData.user.phone.replace(/[^\d]/g,'') : '',
				email: rowData.user.email,
				diet: rowData.user.diet,
				shirtSize: rowData.user.shirtSize,

				firstHackathon: rowData.firstHackathon? 'Y' : 'N',
				comments: rowData.comments? rowData.comments.trim() : '',
				times: rowData.times? rowData.times.join(', ') : '',
				skills: rowData.skills? rowData.skills.trim() : '',
				affiliation: rowData.affiliation
			};

			// grab data for times
			saveTimes(rowData.times, newRow.firstName + ' ' + newRow.lastName);

			// save new & delete original
			finalRows.push(newRow);
			data[i] = null;
		});

		// Build the row table
		makeTimeView();

		return {
			data: finalRows
		};
	}


	function structureCols(colLinks) {
		let cols = [];
		for(let name in colLinks) {
			if(colLinks.hasOwnProperty(name)) {
				let link = colLinks[name];
				if(typeof link === 'string') {
					cols.push({
						data: link
					});
				} else {
					// non-standard data
					cols.push(link);
				}
			}
		}
		return cols;
	}

	/**
	 * Handle time totals
	 */
	let viewTimes = $('table#times');
	let timeData = {
		// timeName: {count, names[]}
	};

	function saveTimes(times, mentorName) {
		times.forEach(function(timeName) {
			if(!timeData[timeName]) {
				timeData[timeName] = {
					count: 0,
					names: []
				};
			}

			timeData[timeName].count += 1;
			timeData[timeName].names.push(mentorName);
		});
	}

	// gets rows from timeData obj
	function structureTimeData() {
		let rows = [];
		for(let timeName in timeData) {
			if(timeData.hasOwnProperty(timeName)) {
				timeData[timeName].names.sort(sortAlphabetically);

				rows.push({
					timeName: timeName,
					count: timeData[timeName].count,
					names: timeData[timeName].names.join(', ')
				});
			}
		}

		return rows;
	}

	function sortAlphabetically(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();
		if(a < b) {
			return -1;
		}
		if(a > b) {
			return 1;
		}
		return 0;
	}

	function makeTimeView() {
		let timeRows = structureTimeData();
		timeRows.forEach(function(rowData) {
			let row = viewTimes.find('tr[data-time="'+rowData.timeName+'"]');
			if(row.length) {
				row.append(`<td>${rowData.count}</td>`);
				row.append(`<td>${rowData.names}</td>`);
			}
			console.log('row', row);
		});
	}

})();
