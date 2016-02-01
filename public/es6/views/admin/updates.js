/**
 * For /admin/updates
 *
 * Displays updates
 * Sends updates
 * Deletes updates
 */

/* globals moment */
(function() {
	'use strict';

	let viewTable = $('table');

	let dTable = viewTable.DataTable({
		ajax: getData,
		scrollX: true,
		columns: [
			{ data: 'date' },
			{ data: 'title' },
			{ data: 'subtitle' }
		],
		dom: '<"view-top"<"col-sm-6"l><"col-sm-6"fBr>><"view-table"t><"view-bottom"<"col-sm-6"i><"col-sm-6"p>>',
		buttons: ['excel'],
		order: [[0, 'desc']]
	});

	// style excel button
	$('.view-updates a.buttons-excel')
		.removeClass('btn-default')
		.addClass('btn-success')
		.find('span').text('Export Excel');

	function getData(data, cb) {
		$.ajax({
			method: 'GET',
			url: '/admin/updates/list',
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
				date: moment(rowData.createdAt).local().format('YY-MM-DD HH:mm'),
				title: rowData.title,
				subtitle: rowData.subtitle
			};

			// save new & delete original
			finalRows.push(newRow);
			data[i] = null;
		});

		console.log('Got ' + finalRows.length + ' updates', finalRows);

		return {
			data: finalRows
		};
	}


	function deleteUpdate(objectId) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'POST',
				url: '/admin/updates/delete',
				data: {
					objectId: objectId
				},
				success: function(res) {
					if(res.error) {
						reject(res.error);
						return;
					}
					resolve();
				},
				error: function(err) {
					reject(err);
				}
			});
		});
	}

	window.deleteUpdate = function(objectId) {
		deleteUpdate(objectId)
		.then(function() {
			console.log('Deleted Update', objectId);
		})
		.catch(function(err) {
			console.error(err);
		});
	};

	let updateForm = $('form');
	let submitBtn = updateForm.find('button');

	updateForm.submit(function(ev) {
		ev.preventDefault();

		submitBtn.prop('disabled', true);
		submitBtn.text('...');

		getFormData()
		.then(validateFormData)
		.then(saveUpdate)
		.then(showSuccess)
		.then(resetForm)
		.then(updateTable)
		.catch(function(err) {
			console.error('Error submitting', err);

			updateForm.before(`
				<div class="alert alert-danger alert-dismissable" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<b>Error sending update!</b> ${typeof err === 'string'? err : 'Check the console log for details'}
				</div>
			`);

			submitBtn.text('Error!');
			setTimeout(function() {
				submitBtn.text('Send');
				submitBtn.prop('disabled', false);
			}, 2000);
		});
	});

	function getFormData() {
		return Promise.resolve({
			title: $('#title').val().trim(),
			subtitle: $('#subtitle').val().trim(),
			sendPush: $('#send-push').prop('checked')
		});
	}

	function validateFormData(data) {
		if(!data.title) {
			return Promise.reject('Form invalid');
		}

		// subtitle optional

		if(!data.sendPush) {
			let check = confirm('Are you sure you want to push this update without a push notification?');
			if(!check) {
				return Promise.reject('Did not want to send it without push');
			}
		}

		return Promise.resolve(data);
	}

	function saveUpdate(data) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'POST',
				url: '/admin/updates/send',
				data: data,
				success: function(res) {
					if(res.error) {
						reject(res.error);
						return;
					}
					resolve(data);
				},
				error: function(err) {
					reject(err);
				}
			});
		});
	}

	function showSuccess(data) {
		console.log('Update Sent', data);
		updateForm.before(`
			<div class="alert alert-success alert-dismissable" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<p>
					<i><b>Update Sent!</b></i></br>
					<b>Title:</b> ${data.title}<br>
					<b>Subtitle:</b> ${data.subtitle}<br>
					<b>Push?:</b> ${data.sendPush? 'Yes' : 'No'}
				</p>
			</div>
		`);

		return Promise.resolve();
	}

	function resetForm() {
		$('#title').val('');
		$('#subtitle').val('');
		submitBtn.prop('disabled', false);
		submitBtn.text('Send');

		return Promise.resolve();
	}

	function updateTable() {
		dTable.ajax.reload();
		return Promise.resolve();
	}

})();
