'use strict'


angular.module('seanMilburnEssensysApp', ['ngRoute'])  
    //Template config set up for scalability
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
    //Factory service to import the csv file
    .factory('ParserService', function($http, $q) {
        //url to dropbox, where the csv is stored on the cloud
        var csvUrl = "https://dl.dropboxusercontent.com/s/gqe0q7j0fyc5ov2/Test_csv.csv";

        var statusCode;
        var getData = function() {
            var deferred = $q.defer();
            $http({
                url: csvUrl
            }).
            //Success promise return data for headers and rows
            success(function(response, status) {
                statusCode = status;
                //Pushes csv data to array
                var data = $.csv.toArrays(response);
                deferred.resolve({
                    //formats csv data
                    'header': data[0],
                    'rows': data.slice(1, data.length)
                });
            }).
            //Returns error response if promise is not met
            error(function(response, status) {
                statusCode = status;
            });
            return deferred.promise;
        };
        return {
            getData: getData
        };
    })
    //Controller to populate view with data
    .controller('myCtrl', function($scope, ParserService) {
        
        $scope.header = [];
        $scope.rows = [];
        //getData function to populate table
        $scope.getData = function() {
            ParserService.getData().then(function(result) {
                $scope.header = result.header;
                $scope.rows = _.filter(result.rows, function(row) { 
                    return row[0] !== "" 
                })
            })
        };
        //Function toggle button label for accordian functionality
        $scope.toggleLabel = function() {
            $('.btn').text(function(i, text){
                return text === "Show Table" ? "Hide Table" : "Show Table";
            })
        };
        //Call getData function on initialize
        $scope.getData();
    });