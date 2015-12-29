'use strict';

angular.module('Dashboard', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider) {
	$routeProvider
		.when('/hackers', {
			templateUrl: 'hackers.html',
			controller: 'HackersCtrl',
			controllerAs: 'hackers'
		})
		.when('/students/:id', {
			templateUrl: 'student.html',
			controller: 'StudentsCtrl',
			controllerAs: 'student'
		})
		.when('/schools', {
			templateUrl: 'schools.html',
			controller: 'SchoolsCtrl',
			controllerAs: 'schools'
		});
})
.controller('HackersCtrl', ['$http', HackersCtrl])
.controller('StudentsCtrl', ['$http', '$routeParams', StudentsCtrl])
.controller('SchoolsCtrl', ['$http', SchoolsCtrl]);

function StudentsCtrl($http, $routeParams) {
	var vm = this;
	vm.loading = true;
	vm.p = $routeParams.id;
	console.log($routeParams.id);

	$http.get('/api/hackers/' + $routeParams.id)
		.then(function(results) {
			vm.data = results.data;
		})
		.catch(function(error) {
			console.log(error);
		})
		.finally(function() {
			vm.loading = false;
		});
}

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
