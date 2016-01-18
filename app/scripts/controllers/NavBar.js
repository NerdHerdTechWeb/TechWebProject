(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('NavBar', navBar);

    /**
     *
     * @param $scope
     * @param $window
     * @param $modal
     */
    function navBar($scope, $rootScope, $modal, user) {
        $scope.annotator = {"status":false};

        $scope.$watch('annotator.status',function(newVal, oldVal){

        });

        $scope.filters = {};
        $scope.filtersShow = false;
        $scope.logStatus = user.logInStatus();
        $rootScope.help = false;

        $scope.showModalFilter = function (){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/documentSearchFilter.html',
                controller: 'DocumentSearchFilter',
                scope: $scope,
                size: 'lg',
                resolve: {
                    filters: function () {
                        return $scope.filters;
                    }
                }
            });
        }
        
        $scope.showUnSavedAnnotations = function (){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/unsavedAnnotationModal.html',
                controller: 'UnsavedAnnotationsManagerModal',
                scope: $scope,
                size: 'lg'
            });
        }
        
        $scope.login = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/userLoginModal.html',
                controller: 'UserLoginModal',
                scope: $scope,
                size: 'lg'
            });
        }

        $scope.showHelp = function(){
            $rootScope.help = !$rootScope.help;
            if($rootScope.help)
                if(angular.element('.show-nav').length > 0)
                    angular.element('.toggle-nav').triggerHandler('click');
        }
        
        $scope.$watch(function($scope){$scope.logStatus = user.logInStatus();});
        
        $scope.$on('logInEvent', function(event, args){
            $scope.logStatus = user.logInStatus();
        })
        
        $scope.logout = function(){
            user.logout();
            $scope.logStatus = user.logInStatus();
        }
    }
})();