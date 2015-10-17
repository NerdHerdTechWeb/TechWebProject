(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('documents', documents);

    function documents($resource) {

        // ngResource call to our static data
        var Documents = $resource('api/scraping/dlib');
        var currentDocumentSource = '';

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
                currentDocumentSource = link;
                return results;
            }, function(error) { // Check for errors
                console.log(error);
            });
        }

        function getCurrentDocumentSource(){
            return currentDocumentSource;
        }

        return {
            getDocuments: getDocuments,
            getDocument: getDocument,
            getCurrentDocumentSource: getCurrentDocumentSource
        }
    }

})();