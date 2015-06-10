(function () {

    'use strict';

    var semanticNotations = angular
        .module('semanticNotations', [
            'ngResource',
            'ngRoute',
            'ui.bootstrap'
        ]);

    semanticNotations.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/help', {
                    templateUrl: 'partials/help.html'
                }).
                when('/about', {
                    templateUrl: 'partials/about.html'
                }).
                when('/annotator', {
                    templateUrl: 'partials/annotator.html'
                }).
                otherwise({
                    redirectTo: '/homeproject',
                    templateUrl: 'partials/index.html'
                });
        }]);

})();