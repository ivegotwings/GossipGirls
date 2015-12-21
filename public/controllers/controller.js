var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl',['$scope','$http',
	function($scope, $http){
		$scope.contact = { name: "" , location: ""};
		$scope.details = [];
		$scope.notification = {};

		console.log("Hello World From Controller");
		refresh = function(){
			$http.get('/gossipgirl').success(function(response){
				console.log("I received a Get Response");
				console.log(response);
				$scope.details = JSON.parse(response);
			});			
		}
		refresh();
		$scope.addDetails = function(){
			$http.post('/gossipgirl', $scope.contact).success(function(res){
				console.log(res);
				refresh();
			})
		}
		$scope.remove = function(id){
			$http.delete('/gossipgirl/' + id).success(function(res){
				console.log("Received Del Response")
				refresh();
			})
		}
		$scope.edit = function(id){
			console.log(id);
			$http.get('/gossipgirl/' + id).success(function(res){
				console.log("Received Edit Response");
				$scope.contact = res;
				console.log($scope.contact);
			})
		}
		$scope.update = function(){
			console.log($scope.contact);
			$http.put('/gossipgirl/' + $scope.contact._id, $scope.contact).success(function(res){
				console.log("Received Put Response");
				refresh();
			})
		}		
}]);