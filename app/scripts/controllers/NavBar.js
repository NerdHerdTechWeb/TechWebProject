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
    function navBar($scope, $window, $modal, $log, user) {
        $scope.annotator = {"status":false};

        $scope.$watch('annotator.status',function(newVal, oldVal){

        });

        $scope.filters = {};
        $scope.logStatus = user.logInStatus();

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
        
        $scope.login = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/userLoginModal.html',
                controller: 'UserLoginModal',
                scope: $scope,
                size: 'lg'
            });
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