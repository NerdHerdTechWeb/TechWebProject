(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('DocumentSearchFilter', documentSearchFilter);

    function documentSearchFilter($window,
                                  $filter,
                                  $resource,
                                  $scope,
                                  $modalInstance,
                                  $log,
                                  Notification,
                                  filters,
                                  documents) {

        $scope.filters = {};
        $scope.documentSearchResult = [];
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.minDate = new Date(2000, 5, 22);

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.status = {
            opened: false
        };

        $scope.searchFilter = function () {
            var filters = $scope.filters;
            var date = $filter('date')(new Date($scope.filters.date), $scope.format)
            var merged = angular.extend(filters,{"date":date});
            
            $scope.isDisabled = true;
            
            var Search = $resource('//'+$window.location.host+'/api/search/get.json', {},
            {
                documents: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    isArray: true
                }
            });
            return Search.documents($.param(merged)).$promise.then(function(results) {
                if(results[0].class){
                    Notification.warning('No results matching your search');
                }else{
                    $scope.$emit('documentFiltered', results);
                }
                $modalInstance.close();
            }, function(error) {
                // Check for errors
                $log.error(error);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.today = function() {
            $scope.dt = $filter('date')(new Date(), $scope.format);
        };

        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
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