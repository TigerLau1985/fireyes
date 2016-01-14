function listPackages($scope, $http) {
	$http.get('/test_case/package').success(function(data){
		$scope.packages = data;
	});
}