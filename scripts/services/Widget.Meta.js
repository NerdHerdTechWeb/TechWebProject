(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('meta', meta);

    function meta($resource) {

        // ngResource call to our static data
        var Meta = $resource('data/notations.json');

        function getMeta() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return Meta.query().$promise.then(function(results) {
                return results;
            }, function(error) { // Check for errors
                console.log(error);
            });
        }

        return {
            getMeta: getMeta
        }
    }

})();