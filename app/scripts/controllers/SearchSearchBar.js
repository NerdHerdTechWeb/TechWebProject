(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(annotationManager, $scope, $rootScope, $window, $log) {

        $scope.search = '';
        $rootScope.documentScraped = false;
        
        $scope.doSearch = function(val){
            if(val)
                $rootScope.$broadcast('getDocumentFromSearchField', $scope.search);
        }
        
        $scope.doScraping = function(val){
            annotationManager.scraping(val).then(function(results){
                $log.info(results);
                $rootScope.documentScraped = true;
            }); 
        }
        
        $scope.$on('noAnnotationsFounded',function(event, val){
            annotationManager.scraping(val).then(function(results){
                $log.info(results);
                $rootScope.documentScraped = true;
            }); 
        });
    }
})();