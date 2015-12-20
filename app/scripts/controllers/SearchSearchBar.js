(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(annotationManager, $scope, $rootScope, $window, $log) {

        $scope.search = '';
        
        $scope.doSearch = function(val){
            
            $rootScope.$broadcast('getDocumentFromSearchField', $scope.search);
            
            annotationManager.scraping(val).then(function(results){
                $log.info(results);
            });
        }
    }
})();