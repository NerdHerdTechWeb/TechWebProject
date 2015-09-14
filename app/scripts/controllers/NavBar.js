(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('NavBar', navBar);

    function navBar($scope, $window, $modal) {
        $scope.annotator = {"status":false};

        $scope.$watch('annotator.status',function(newVal, oldVal){

        });

        $scope.filters = {};

        $scope.showModalFilter = function (){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/documentSearchFilter.html',
                controller: 'DocumentSearchFilter',
                size: 'lg',
                resolve: {
                    filters: function () {
                        return $scope.filters;
                    }
                }
            });
        }
    }
})();