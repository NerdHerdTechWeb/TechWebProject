/**
 * Bootstrapping frontend application
 * Setting up main route provider
 *
 */

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
                    templateUrl: init_conf.partialsView + 'help.html'
                }).
                when('/about', {
                    templateUrl: init_conf.partialsView+'about.html'
                }).
                when('/annotator', {
                    templateUrl: init_conf.partialsView+'annotator.html'
                }).
                otherwise({
                    redirectTo: '/homeproject',
                    templateUrl: init_conf.partialsView+'index.html'
                });
        }]);

})();