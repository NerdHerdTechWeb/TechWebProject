(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('documents', documents);

    function documents($resource) {

        // ngResource call to our static data
        var Documents = $resource('api/scraping/rstat');

        function getDocuments() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return Documents.query().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                console.log(error);
            });
        }

        function getDocument(link, from) {
            var Document = $resource('api/scraping/get/document?link='+link+'&from='+from);
            return Document.query().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                console.log(error);
            });
        }

        return {
            getDocuments: getDocuments,
            getDocument: getDocument
        }
    }

})();