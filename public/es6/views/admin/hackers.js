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

		'GitHub': 'github',
		'Want Job': 'wantjob',

		'>18?': 'yesno18',
		'First?': 'firstHackathon',
		'Shirt': 'shirtSize',

		'Diet': 'diet',
		'Comments': 'comments',
		'Hate': 'hate'
	};

	// make header
	Object.keys(columns).forEach(function(name, i) {
		viewHeader.append(`<th>${name}</th>`);
		viewToggle.prepend(`<div class="btn btn-default btn-xs active" data-col="${i}">${name}</div>`);
	});


	viewTable = viewTable.DataTable({
		ajax: getData,
		scrollX: true,
		columns: structureCols(columns),
	});

	viewToggle.children().click(function(e) {
		toggleCol($(this).data('col'));
	});

	function toggleCol(i) {
		var col = viewTable.column(i);
		col.visible(!col.visible());
		viewToggle.find(`[data-col="${i}"]`).toggleClass('active', col.visible());
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
		data.forEach(function(rowData, i) {
			finalRows.push({
				firstName: rowData.user.firstName,
				lastName: rowData.user.lastName,
				github: rowData.user.github,
				phone: formatPhone(rowData.user.phone),
				email: rowData.user.email,
				diet: rowData.user.diet,
				shirtSize: rowData.user.shirtSize,
				school: rowData.school,
				major: rowData.major,
				firstHackathon: rowData.firstHackathon? 'Y' : 'N',
				hate: rowData.hate? rowData.hate.trim() : '',
				year: rowData.year,
				wantjob: rowData.wantjob? rowData.wantjob.join(', ') : '',
				comments: rowData.comments? rowData.comments.trim() : '',
				yesno18: rowData.yesno18 === false? 'N' : ''
			});

			// delete original
			data[i] = null;
		});

		return {
			data: finalRows
		};
	}

	function formatPhone(str) {
		let clean =  str.replace(/^[0-9]/g, '');
		if(clean.length !== 9) {
			return clean;
		}
		return `(${clean.substring(0,3)}) ${clean.substring(3,6)}-${clean.substring(6)}`;
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
