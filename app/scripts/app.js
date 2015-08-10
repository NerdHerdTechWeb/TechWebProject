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
            'ui.bootstrap',
            'toggle-switch',
            'ui.tinymce'
        ])
        .directive('lateralMenu', LateralMenu)

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
        
        function LateralMenu(){
            return {
                restrict: 'AC',
                link: function (scope, element, attrs) {
                    jQuery(element).on('mouseout',function(event){jQuery(this).addClass('menu-close').removeClass('menu-open')})
                    jQuery(element).on('mouseover',function(event){jQuery(this).addClass('menu-open').removeClass('menu-close')})
                }
            }
        }

})();