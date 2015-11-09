(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('ModalsPaginator', modalsPaginator);

    function modalsPaginator($scope, $rootScope, $modal, $log, annotationManager, $window) {

        $scope.showPaginator = false;

        $scope.maxSize = 4;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        /**
         * Trigger event of page changing
         * The listener is into DocumentManager controller
         */
        $scope.pageChanged = function () {
            $rootScope.$broadcast('change-modal-page', {"pageIndex": $scope.bigCurrentPage});
        };

        $scope.$watch(
            function () {
                return annotationManager.getModalsPaginatorCount();
            },
            function (newVal) {
                if (newVal >= 1) {
                    $scope.showPaginator = true;
                    $scope.bigTotalItems = newVal * 10;
                    $log.info('Show pagination');
                }
                if (newVal === 0) {
                    $scope.showPaginator = false;
                    $scope.bigTotalItems = newVal * 10;
                    $log.info('Hide pagination');
                }
            }
        );
    }
})();