/**
 * Manages user data for /admin/users
 */

(function() {
	'use strict';

	const GET_LIST_URL = '/judge/hacks/list';

	let viewTable = $('table#view');
	let viewHeader = viewTable.find('thead tr');
	let viewToggle = $('#view-toggle');
	let columns = {
		'Table #': 'tableNumber',
		'Name': 'name',
		'Categories': 'categories',
		'Team Members': 'team'
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
			url: GET_LIST_URL,
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
				name: rowData.name,
				tableNumber: rowData.tableNumber,
				categories: rowData.categories.join(', '),
				team: rowData.team.join(', ')
			};

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

	// BUTTON ACTIONS TODO


	let buttonActions = {
	};

	function confirmPost(url, data) {
		return new Promise(function(resolve, reject) {
			let conf = confirm('Are you SURE you want to make this user an admin?');
			if(conf) {
				post(url, data)
				.then(resolve)
				.catch(reject);
			} else {
				reject('Did not want to do it');
			}
		});
	}

	window.preformButtonAction = function(btn, actionName) {
		console.log('Action', actionName);
		if(buttonActions[actionName]) {
			buttonActions[actionName](btn);
		} else {
			throw new Error(`Invalid Button Action ${actionName}`);
		}
	};

	function createActionBtnHtml(actionName, enable, objectId) {
		return `
		<button
			data-object-id="${objectId}"
			onclick="preformButtonAction(this, '${actionName}')"
			class="btn btn-primary btn-sm"
			${enable? '' : 'disabled'}
		>${actionName}</button>`;
	}

	function createPromiseAction(promise) {
		let btnClass = 'btn-primary';

		return function(btn) {
			btn = $(btn);

			let actionText = btn.text();
			btn.prop('disabled', true);
			btn.text('...');

			promise(btn)
			.then(function() {
				console.log('Btn Action Succss', actionText);
				btn.removeClass(btnClass);
				btn.addClass('btn-success');
				btn.text('DONE!');
			})
			.catch(function(err) {
				// action failure
				console.error('Btn Action Error', actionText, err);
				btn.text('ERROR!');
				btn.removeClass(btnClass);
				btn.addClass('btn-danger');

				// enable retry
				setTimeout(function() {
					btn.text(actionText);
					btn.addClass(btnClass);
					btn.removeClass('btn-danger');
					btn.prop('disabled', false);
				}, 3000);
			});
		};
	}


	// post promise wrapper
	function post(url, data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'POST',
				url: url,
				data: data,
				success: function(res) {
					if(res.error) {
						reject(res.error);
					} else {
						resolve(res);
					}
				},
				error: reject
			});
		});
	}


})();
