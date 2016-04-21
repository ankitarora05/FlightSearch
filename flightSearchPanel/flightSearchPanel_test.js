'use strict';

describe('flightSearch.flightSearchHome module', function() {
     var $rootScope, $scope, $controller;
    //beforeEach(module('flightSearch.flightSearchHome'));
    beforeEach(function() {
        module('ngRoute');
        module('flightSearch.flightSearchHome');
    });

    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    describe('flightSearchHome controller', function() {

        it('should check controller is binded to the markup', inject(function($controller) {
            //spec body
            var view1Ctrl = $controller('FlightSearchCtrl');
            expect(view1Ctrl).toBeDefined();
        }));

        it('should set round trip active tab', function(){
            expect($scope.activeTab == 'roundTrip');
        });

        it('should hide date range for departure', function(){
            expect($scope.showDepartDateRange === false);
        });

        it('should hide date range for returning', function(){
            expect($scope.showReturnDateRange === false);
        });

        it('should initialize the departure date as today', function(){
            expect($scope.dateStDept === new Date());
        });

        it('should initialize the returing date as today', function(){
            expect($scope.dateStReturn === new Date());
        });

        it('should bind a callback for on selection of return date function to be defined', function(){
            expect($scope.optionsStDept).hasOwnProperty('callback');
        });

        it('should bind a callback for on selection of departure date function to be defined', function(){
            expect($scope.dateStReturn).hasOwnProperty('callback');
        });
    });
});
