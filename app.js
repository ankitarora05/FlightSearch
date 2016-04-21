'use strict';

// Declare app level module which depends on views, and components
angular.module('flightSearch', [
    'ngRoute',
    'flightSearch.flightSearchHome',
    'mightyDatepicker',
    'rzModule'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/flightSearchHome', {
        templateUrl: 'flightSearchPanel/flightSearchHome.html',
        controller: 'FlightSearchCtrl'
    }).otherwise({ redirectTo: '/flightSearchHome' });
}]);
