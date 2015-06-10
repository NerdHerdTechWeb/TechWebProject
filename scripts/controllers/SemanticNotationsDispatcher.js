(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SemanticNotationsDispatcher', semanticNotationsDispatcher);

    function semanticNotationsDispatcher(meta, $scope, $window) {

        // vm is our capture variable
        var vm = this;

        vm.notationsEntries = [];

        meta.getMeta().then(function(results) {
            vm.notationsEntries = results;
            console.log(vm.notationsEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });
    }
})();
