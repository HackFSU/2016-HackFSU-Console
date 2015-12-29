'use strict';

angular.module('Dashboard', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider) {
	$routeProvider
		.when('/hackers', {
			templateUrl: 'hackers.html',
			controller: 'HackersCtrl',
			controllerAs: 'hackers'
		})
		.when('/schools', {
			templateUrl: 'schools.html',
			controller: 'SchoolsCtrl',
			controllerAs: 'schools'
		});
})
.controller('HackersCtrl', ['$http', HackersCtrl])
.controller('SchoolsCtrl', ['$http', SchoolsCtrl]);

function SchoolsCtrl($http) {
	var vm = this;
	vm.loading = true;

	$http.get('/api/schools')
		.then(function(result) {
			vm.data = result.data;
			vm.dataLength = Object.keys(vm.data).length;
		})
		.catch(function(error) {
			console.log('Uh oh... Error getting from schools API\n');
		})
		.finally(function() {
			vm.loading = false;
		});
}

function HackersCtrl($http) {
	var vm = this;
	vm.loaded = false;
	$http.get('/api/hackers').then(function(result) {
		vm.data = result.data;
		vm.loaded = true;
	});
}
