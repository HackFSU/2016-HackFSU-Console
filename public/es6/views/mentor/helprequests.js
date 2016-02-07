/**
 * /mentor/helprequests
 * Manages help request loading/assignment
 */
(function() {
	'use strict';

	const GET_LIST_URL = '/mentor/helprequests/list';
	const POST_ASSIGN_TO_ME_URL =  '/mentor/helprequests/assignToMe';
	const TABLE_REFRESH_RATE = 30*1000; // 30s

	let viewTable = $('table#helpreqs');
	let viewHeader = viewTable.find('thead tr');
	let columns = {
		'Created At': 'createdAt',
		'Name': 'name',
		'Description': 'description',
		'Location': 'location',
		'Assigned To': 'assignedMentorName',
		'Actions': 'actions'
	};

	// make header
	Object.keys(columns).forEach(function(name, i) {
		viewHeader.append(`<th>${name}</th>`);
	});


	viewTable = viewTable.DataTable({
		ajax: getData,
		scrollX: true,
		columns: structureCols(columns),
		dom: '<"view-top"<"col-sm-6"l><"col-sm-6"fBr>><"view-table"t><"view-bottom"<"col-sm-6"i><"col-sm-6"p>>',
		aLengthMenu: [
			[25, 50, 100, 200, -1],
			[25, 50, 100, 200, 'All']
		],
		order: [
			[4, 'asc'],
			[0, 'desc']
		]
	});

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
				name: '' + rowData.name,
				description: '' + rowData.description,
				location: '' +rowData.location,
				assignedMentorName: '',
				actions: '',
				createdAt: moment(rowData.createdAt).local().format('M/D HH:mm')
			};


			let mentor = rowData.assignedMentor;
			if(mentor && mentor.user) {
				newRow.assignedMentorName = `${mentor.user.firstName} ${mentor.user.lastName}`;
			} else {
				newRow.actions += createActionBtnHtml(
					'Assign to me', !mentor, rowData.objectId
				);
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

	// BUTTON ACTIONS


	let buttonActions = {
		'Assign to me': createPromiseAction(function(btn) {
			return post(POST_ASSIGN_TO_ME_URL, {
				helpRequestId: btn.data('objectId')
			});
		})
	};

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

	// auto refresh table
	setInterval(function() {
		console.log('==== table refreshing ====');
		viewTable.ajax.reload();
	}, TABLE_REFRESH_RATE);


})();
