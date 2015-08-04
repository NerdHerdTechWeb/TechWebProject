(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('NavBar', navBar);

    function navBar($scope, $window) {
        $scope.annotator = {"status":false};
        
    }
})();