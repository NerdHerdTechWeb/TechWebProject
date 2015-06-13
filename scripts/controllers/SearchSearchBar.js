(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(scraping, $scope, $window) {

        // vm is our capture variable
        var vm = this;

        $scope.search = {};

        vm.scrapedDataEntries = [];

        scraping.getScrapedData().then(function(results) {
            vm.scrapedDataEntries = results;
            console.log(vm.scrapedDataEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });
    }
})();
