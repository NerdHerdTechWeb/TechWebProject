(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UserLoginModal', userLoginModal);

    function userLoginModal($scope, $modalInstance, user) {

        $scope.doLogin = function () {
            user.login();
            $scope.$emit('logInEvent');
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();