(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UserLoginModal', userLoginModal);

    function userLoginModal($scope, $modalInstance, user) {

        $scope.doLogin = function () {
            var isValidForm = $scope.form.$valid;
            if(isValidForm){
                user.login($scope.user);
                $scope.$emit('logInEvent');
                $modalInstance.close();
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();