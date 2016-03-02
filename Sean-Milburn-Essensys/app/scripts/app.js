'use strict';

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
        var result = false;
        var getData = function() {
            var deferred = $q.defer();
            $http({
                url: csvUrl
            }).
            success(function(response, status) {
                statusCode = status;
                result = response;
                deferred.resolve(result);
            }).
            error(function(response, status) {
                statusCode = status;
            });
            return deferred.promise;
        };
        return {
            getData: getData,
            parseData: function() {
                var data = $.csv.toArrays(result);
                return {
                    'header': data[0],
                    'rows': data.slice(1, data.length)
                };
            }
        };
    })
    
    .controller('myCtrl', function($scope, ParserService) {
        $scope.header = [];
        $scope.rows = [];
        $scope.getData = function() {
            ParserService.getData().then(function(data) {
                result = ParserService.parseData();
                $scope.header = result.header;
                $scope.rows = result.rows;
            });
        };
    });