(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('FragmentModal', fragmentModal);

    function fragmentModal($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();