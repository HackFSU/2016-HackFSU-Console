/**
 * For /admin/stats
 * Handles the loading & displaying of the stats
 */


(function() {
	'use strict';

	let totalsView = $('.view-totals');
	let shirtsView = $('.view-shirts');
	let anonsView = $('.view-anons');



	get('/admin/stats/totals')
	.then(displayTotals)
	.catch(handleError);

	get('/admin/stats/shirts')
	.then(displayShirts)
	.catch(handleError);

	get('/admin/stats/anonstats')
	.then(displayAnons)
	.catch(handleError);



	function get(path) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				method: 'GET',
				url: path,
				success: function(res) {
					if(res.error) {
						reject(res.error);
					}
					resolve(res);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	}

	function handleError(err) {
		console.log(err);
		alert('Error loading data! Check console for details.');
	}

	function displayTotals(totals) {
		let body = totalsView.find('table tbody');

		for(let group in totals) {
			if(totals.hasOwnProperty(group)) {
				body.append(`
					<tr>
						<td><b>${group}</b></td>
						<td>${totals[group]}</td>
					</tr>
				`);
			}
		}

		totalsView.find('.loading-message').remove();
		return Promise.resolve();
	}


	function displayShirts(shirts) {
		let body = shirtsView.find('table tbody');

		for(let size in shirts) {
			if(shirts.hasOwnProperty(size)) {
				body.append(`
					<tr>
						<td>${size}</td>
						<td>${shirts[size]}</td>
					</tr>
				`);
			}
		}


		shirtsView.find('.loading-message').remove();
		return Promise.resolve();
	}


	function displayAnons(anonStats) {

		for(let stat in anonStats) {
			if(anonStats.hasOwnProperty(stat)) {
				addStatTable(stat, anonStats[stat]);
			}
		}

		anonsView.find('.loading-message').remove();
		return Promise.resolve();
	}

	function addStatTable(title, options) {
		let body = $(`
			<div class="view-container">
			<table class="table table-striped table-hover table-bordered">
				<thead>
					<tr>
						<td colspan="2"><b>${title}</b></td>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			</div>
		`).appendTo(anonsView).find('tbody');

		for(let option in options) {
			if(options.hasOwnProperty(option)) {
				body.append(`
					<tr>
						<td>${option}</td>
						<td>${options[option]}</td>
					</tr>
				`);
			}
		}
	}

})();
