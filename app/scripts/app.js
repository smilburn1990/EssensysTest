'use strict'


angular.module('seanMilburnEssensysApp', ['ngRoute'])  
    
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    
    .factory('ParserService', function($http, $q) {

        var csvUrl = "https://dl.dropboxusercontent.com/s/gqe0q7j0fyc5ov2/Test_csv.csv";

        var statusCode;
        var getData = function() {
            var deferred = $q.defer();
            $http({
                url: csvUrl
            }).
            success(function(response, status) {
                statusCode = status;
                var data = $.csv.toArrays(response);
                deferred.resolve({
                    'header': data[0],
                    'rows': data.slice(1, data.length)
                });
            }).
            error(function(response, status) {
                statusCode = status;
            });
            return deferred.promise;
        };
        return {
            getData: getData
        };
    })
    
    .controller('myCtrl', function($scope, ParserService) {
        
        $scope.header = [];
        $scope.rows = [];
        $scope.getData = function() {
            ParserService.getData().then(function(result) {
                $scope.header = result.header;
                $scope.rows = _.filter(result.rows, function(row) { 
                    return row[0] !== "" 
                })
            })
        };
        $scope.toggleLabel = function() {
            $('.btn').text(function(i, text){
                return text === "Show Table" ? "Hide Table" : "Show Table";
            })
        };
        $scope.getData();
    });