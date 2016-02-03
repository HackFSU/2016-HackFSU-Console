/**
 * Manages hacker data for /admin/hackers
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

		'Year': 'year',
		'School': 'school',
		'Major': 'major',

		'Status': 'status',

		'GitHub': 'github',
		'Want Job': 'wantjob',
		'Interested In' : 'wants',

		'>18?': 'yesno18',
		'First?': 'firstHackathon',
		'Shirt': 'shirtSize',

		'Diet': 'diet',
		'Comments': 'comments',
		'Hate': 'hate',

		'Resume': 'resume',
		'Created At': 'createdAt'
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
			url: '/admin/hackers/data',
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
				github: rowData.user.github,
				phone: rowData.user.phone? rowData.user.phone.replace(/[^\d]/g,'') : '',
				email: rowData.user.email,
				diet: rowData.user.diet,
				shirtSize: rowData.user.shirtSize,
				status: rowData.status || '',
				school: rowData.school,
				major: rowData.major,
				firstHackathon: rowData.firstHackathon? 'Y' : 'N',
				hate: rowData.hate? rowData.hate.trim() : '',
				year: rowData.year,
				wantjob: rowData.wantjob? rowData.wantjob.join(', ') : '',
				wants: rowData.wants? rowData.wants.join(', ') : '',
				comments: rowData.comments? rowData.comments.trim() : '',
				resume: rowData.resume? rowData.resume.url : '',
				createdAt: rowData.createdAt
			};

			// handle missing yesno18, do not assume anything if not there
			if(rowData.yesno18 === false) {
				newRow.yesno18 = 'N';
			} else if(rowData.yesno18 === true) {
				newRow.yesno18 = 'Y';
			} else {
				newRow.yesno18 = '';
			}


			// save new & delete original
			finalRows.push(newRow);
			data[i] = null;
		});

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


})();
