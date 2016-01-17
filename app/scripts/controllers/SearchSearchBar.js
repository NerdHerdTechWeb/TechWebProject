(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(annotationManager, Notification, $scope, $rootScope, $log) {

        $scope.search = '';
        $rootScope.documentScraped = false;

        $scope.doSearch = function (val) {
            if (val)
                $rootScope.$broadcast('getDocumentFromSearchField', $scope.search);
        }

        $scope.doScraping = function (val) {
            Notification.info('Scraping started');
            if (val === '') {
                val = $rootScope.currentLoadedDocument || '';
                if(val === '')
                    Notification.warning('Load document first');
            } else
                return;
            annotationManager.scraping(val).then(function (results) {
                $log.info(results);
                $rootScope.documentScraped = true;
            });
        }

        $scope.$on('noAnnotationsFounded', function (event, val) {
            annotationManager.scraping(val).then(function (results) {
                $log.info(results);
                $rootScope.documentScraped = true;
            });
        });
    }
})();