
'use strict';

var dashboard = angular.module('Dashboard', ['ngRoute']);
dashboard.config(function($routeProvider) {
	$routeProvider
		.when('/hackers', {
			templateUrl: 'hackers/index.html',
			controller: 'HackerCtrl'
		});
});

dashboard.controller('TestCtrl', function($scope) {
	$scope.msg = 'Testing';
});

dashboard.controller('HackerCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.loading = true;
	$http.get('/api/hackers').then(function(result) {
		$scope.hackers = result.data;
		$scope.loading = false;
	});
}]);
