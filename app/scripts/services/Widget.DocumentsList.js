/**
 * Get documents list frorm dlib and rivista statistica
 */

(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('documents', documents);

    function documents($resource, $log, $window, Notification) {

        // ngResource call to our static data
        var Documents = $resource('//' + $window.location.host + '/api/scraping/dlib', {},
            {
                all: {
                    method: 'GET',
                    url: '//' + $window.location.host + '/api/scraping/all',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    isArray: true
                },
                rstat: {
                    method: 'GET',
                    url: '//' + $window.location.host + '/api/scraping/rstat',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    isArray: true
                }
            });

        var currentDocumentSource = '';

        function getDocuments() {
            Notification.info('Loading document list...');
            // $promise.then allows us to intercept the results
            // which we will use later
            return Documents.all().$promise.then(function(results) {
                Notification.success('Document list loaded');
                return results;
            }, function(error) { // Check for errors
                Notification.error('Something goes wrong');
                $log.error(error);
            });
        }

        function getDocumentsDlib() {
            return Documents.query().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                Notification.error('Something goes wrong');
                $log.error(error);
            });
        }

        function getDocumentsRstat() {
            return Documents.rstat().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                Notification.error('Something goes wrong');
                $log.error(error);
            });
        }

        function getDocument(link, from) {
            var Document = $resource('api/scraping/get/document?link='+link+'&from='+from);
            return Document.query().$promise.then(function(results) {
                currentDocumentSource = link;
                return results;
            }, function(error) {
                Notification.error('Something goes wrong');
                $log.error(error);
            });
        }

        function getCurrentDocumentSource(){
            return currentDocumentSource;
        }

        return {
            getDocuments: getDocuments,
            getDocumentsDlib: getDocumentsDlib,
            getDocumentsRstat: getDocumentsRstat,
            getDocument: getDocument,
            getCurrentDocumentSource: getCurrentDocumentSource
        }
    }

})();