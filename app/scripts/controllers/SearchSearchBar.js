(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(annotationManager, $scope, $window, $log) {

        $scope.search = '';
        
        $scope.doSearch = function(val){
            
            annotationManager.scraping(val).then(function(results){
                $log.info(results);
            });
        }
    }
})();
