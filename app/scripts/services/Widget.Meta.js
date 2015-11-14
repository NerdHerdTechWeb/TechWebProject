(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('meta', meta);

    function meta($resource, $log, $window) {

        // ngResource call to our static data
        var Meta = $resource('//' + $window.location.host + '/api/scraping/graphlist', {},
            {
                graphlist: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    isArray: true
                },
                readygraph: {
                    method: 'POST',
                    url: '//' + $window.location.host + '/api/scraping/readygraph',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    isArray: true
                }
            });

        function getReadyGraph() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return Meta.readygraph().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                $log.error(error);
            });
        }
        
        function getAvailableGraph() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return Meta.graphlist().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                $log.error(error);
            });
        }

        return {
            getReadyGraph: getReadyGraph,
            getAvailableGraph: getAvailableGraph
        }
    }

})();