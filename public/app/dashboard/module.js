
'use strict';

var dashboardModule = angular.module('dashboardModule', []);

dashboardModule.controller('hackerCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.loading = true;
	$http.get('/api/hackers').then(function(result) {
		$scope.hackers = result.data;
		$scope.loading = false;
	});
}]);
