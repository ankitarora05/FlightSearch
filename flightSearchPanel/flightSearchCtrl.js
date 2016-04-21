'use strict';

angular.module('flightSearch.flightSearchHome', ['mightyDatepicker'])
    .controller('FlightSearchCtrl', ['FlightSearchService', '$scope', function(FlightSearchService, $scope) {
        var vm = this,
            init = function() {
                vm.searchedData = [];
                //vm.breadCrumArray = ["New Delhi", "Pune", "New Delhi"];
                vm.activeTab = 'roundTrip';
                vm.showDepartDateRange = false;
                vm.showReturnDateRange = false;
                vm.fromCity = '';
                vm.toCity = ''
                vm.showDeptDate = false;
                vm.showReturnDate = false;
                vm.passengersCount = 0;
                vm.dateStDept = moment();
                vm.optionsStDept = {
                    callback: vm.deptDateSelected
                };
                vm.dateStReturn = moment();
                vm.optionsStReturn = {
                    callback: vm.retDateSelected
                };
            };
        angular.extend(vm, {
            setActiveTab: function(tab) {
                vm.activeTab = tab;
                vm.searchedData = [];
                vm.searchExecuted = false;
            },
            fetchSearchData: function() {
                var params = {
                    'passengerNumber': vm.passengersCount,
                    'fromCity': vm.fromCity,
                    'toCity': vm.toCity,
                    'departDate': vm.dateStDeptValue,
                    'returnDate': (vm.activeTab === 'roundTrip') ? vm.dateStReturnValue : null
                };
                if (vm.passengersCount && vm.fromCity && vm.toCity && (vm.dateStDeptValue || (vm.dateStReturnValue && vm.activeTab === 'roundTrip'))) {
                    console.log(params);
                    if (vm.activeTab === 'roundTrip') {
                        FlightSearchService.getRoundTripData(params, function(data, status) {
                            if (data) {
                                vm.searchExecuted = true;
                                vm.searchedData = data.flightDetails;
                                vm.flightsType = data.flightType;
                                vm.priceSlider = {
                                    min: data.minPrice,
                                    max: data.maxPrice,
                                    ceil: data.maxPrice,
                                    floor: data.minPrice
                                };
                            }
                        }, function(errorCode, error) {
                            if (error) {
                                console.log(errorCode);
                            }
                        });
                    } else {
                        FlightSearchService.getOneWayData(params, function(data, status) {
                            if (data) {
                                vm.searchExecuted = true;
                                vm.searchedData = data.flightDetails;
                                vm.flightsType = data.flightType;
                                vm.priceSlider = {
                                    min: data.minPrice,
                                    max: data.maxPrice,
                                    ceil: data.maxPrice,
                                    floor: data.minPrice
                                };
                            }
                        }, function(errorCode, error) {
                            if (error) {
                                console.log(errorCode);
                            }
                        });
                    }
                } else {
                    alert('Please provide all the details');
                }

            },

            setPassengerCount: function(count) {
                vm.passengersCount = count;
            },
            deptDateSelected: function(day) {
                vm.dateStDeptValue = FlightSearchService.createDate(day._d);
                vm.showDeptDate = true;
                vm.showDepartDateRange = false;
            },
            retDateSelected: function(day) {
                vm.dateStReturnValue = FlightSearchService.createDate(day._d);
                vm.showReturnDate = true;
                vm.showReturnDateRange = false;
            }
        });
        init();
    }])
    .service('FlightSearchService', ['$http', '$q', function($http, $q) {
        var urls = {
            'getOneWay': 'flightSearchPanel/oneWayJson.json',
            'getRoundTrip': 'flightSearchPanel/roundTrip.json'
        };

        var promiseDataService = function(url) {

            // A small example of object
            var fetchData = {

                // Method that performs the ajax request
                ajax: function(method, url, args) {
                    var defer = $q.defer();
                    $http({
                        method: method,
                        url: url,
                        params: args || {},
                        data: args || {},
                        responseType: "json"
                    }).then(function(response) {
                        defer.resolve(response.data);
                    }, function(response) {
                        defer.reject(response);
                    });
                    return defer.promise;
                }
            };

            // Adapter pattern
            return {
                'get': function(args) {
                    return fetchData.ajax('GET', url, args);
                },
                'post': function(args) {
                    return fetchData.ajax('POST', url, args);
                },
                'put': function(args) {
                    return fetchData.ajax('PUT', url, args);
                },
                'delete': function(args) {
                    return fetchData.ajax('DELETE', url, args);
                }
            };
        };
        // End A

        this.getOneWayData = function(data, callback, errorCallback) {
            promiseDataService(urls.getOneWay)
                .get(data)
                .then(callback)
                .catch(errorCallback);
        };

        this.getRoundTripData = function(data, callback, errorCallback) {
            promiseDataService(urls.getRoundTrip)
                .get(data)
                .then(callback)
                .catch(errorCallback);
        };

        this.createDate = function(date, isDateObject) {
            var returnString = "";
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            returnString = date.getDate() + "-" + months[(date.getMonth() + 1)] + "-" + date.getFullYear();
            return returnString;
        };
    }]).filter('to_trusted', function($sce) {
        return function(text) {
            return text ? $sce.trustAsHtml(text.toString()) : "";
        }
    }).filter('showOnlyFilteredProducts', function() {
        return function(products, min, max) {
            var filtered = [];
            angular.forEach(products, function(product) {
                if (product.price >= min && product.price <= max)
                    filtered.push(product);
            });
            return filtered;
        }
    });
