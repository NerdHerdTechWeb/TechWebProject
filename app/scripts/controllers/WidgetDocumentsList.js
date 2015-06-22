(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetDocumentsList', widgetDocumentsList);

    function widgetDocumentsList(documents, $scope, $window) {

        // vm is our capture variable
        var vm = this;

        vm.documentEntries = [];

        documents.getDocuments().then(function(results) {
            vm.documentEntries = results;
            console.log(vm.documentEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });
    }
})();