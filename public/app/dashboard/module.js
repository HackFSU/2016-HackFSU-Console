
'use strict';

angular.module('Dashboard', ['ngRoute'])
.config(function($routeProvider) {
	$routeProvider
		.when('/hackers', {
			templateUrl: 'hackers.html',
			controller: 'HackersCtrl',
			controllerAs: 'hackers'
		});
})
.controller('HackersCtrl', ['$http', HackersCtrl]);

function HackersCtrl($http) {
	var vm = this;
	vm.loaded = false;
	$http.get('/api/hackers').then(function(result) {
		vm.data = result.data;
		vm.loaded = true;
	});
}
