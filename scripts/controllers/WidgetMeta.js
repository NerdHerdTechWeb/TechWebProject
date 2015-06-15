(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetMeta', widgetMeta);

    function widgetMeta(meta, $scope, $window) {

        // vm is our capture variable
        var vm = this;

        vm.metaEntries = [];

        meta.getMeta().then(function(results) {
            vm.metaEntries = results;
            console.log(vm.metaEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });
    }
})();