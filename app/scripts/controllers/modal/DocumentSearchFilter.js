(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('DocumentSearchFilter', documentSearchFilter);

    function documentSearchFilter($resource, $scope, $modalInstance, filters, documents) {

        $scope.filters = {};

        $scope.searchFilter = function () {
            $modalInstance.close();
            var filters = $scope.filters;
            var date = $scope.dt;
            var merged = angular.extend(filters,{"date":date});
            
            var Search = $resource('//'+window.location.host+'/api/annotations/get.html', {}, 
            {
                save: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
                }
            });
            return Search.save($.param(merged)).$promise.then(function(results) {
                return results;
            }, function(error) {
                // Check for errors
                console.log(error);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];

        $scope.status = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }
})();