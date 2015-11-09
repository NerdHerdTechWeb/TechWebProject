(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('SearchSearchBar', searchSearchBar);

    function searchSearchBar(annotationManager, $scope, $window, $log) {

        $scope.search = {};
        
        $scope.$watch('search',function(val){
            if(val !== '')
                annotationManager.scraping(val).$promise.then(function(results){
                    $log.info(results);
                });
        });
    }
})();
