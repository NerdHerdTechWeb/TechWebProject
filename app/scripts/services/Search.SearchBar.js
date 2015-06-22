(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('scraping', scraping);

    function scraping($resource) {

        // ngResource call to our static data
        var SearchBar = $resource('api/scraping/rdf/1');

        function getScrapedData() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return SearchBar.query().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                console.log(error);
            });
        }

        return {
            getScrapedData: getScrapedData
        }
    }

})();