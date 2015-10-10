/**
 * Bootstrapping frontend application
 * Setting up main route provider
 *
 */


/**
 * Directive
 * Inject and compile html
 *
 */

(function (angular) {
    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
}(window.angular));

(function () {

    'use strict';

    var semanticNotations = angular
        .module('semanticNotations', [
            'ngResource',
            'ngRoute',
            'ngCookies',
            'ui.bootstrap',
            'toggle-switch',
            'ui.tinymce',
            'ui.select2',
            'angular-bind-html-compile',
            'ui-notification',
            'frapontillo.bootstrap-switch'
        ])
        .directive('lateralMenu', LateralMenu)
        .directive('showMenu', showMenu)
        .directive('showFilters', showFilters)
        .directive('filtersSelection', filtersSelection)

    semanticNotations.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/help', {
                    templateUrl: init_conf.partialsView + 'help.html'
                }).
                when('/about', {
                    templateUrl: init_conf.partialsView + 'about.html'
                }).
                when('/annotator', {
                    templateUrl: init_conf.partialsView + 'annotator.html'
                }).
                otherwise({
                    redirectTo: '/homeproject',
                    templateUrl: init_conf.partialsView + 'index.html'
                });
        }]);

    /**
     *
     * @returns {{restrict: string, link: link}}
     * @constructor
     */
    function LateralMenu() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                jQuery(element).on('mouseout', function (event) {
                    jQuery(this).addClass('menu-close').removeClass('menu-open')
                })
                jQuery(element).on('mouseover', function (event) {
                    jQuery(this).addClass('menu-open').removeClass('menu-close')
                })
            }
        }
    }

    /**
     * Show menu and hide fragment filters menu
     * @returns {{restrict: string, link: link}}
     */
    function showMenu(){
        return {
            restrict:'A',
            link: function (scope, elem, attrs){
                elem.on('click', function(){
                    if($('#site-wrapper').hasClass('show-nav')) {
                        $('#site-wrapper').removeClass('show-nav');
                    }else {
                        $('#site-wrapper').addClass('show-nav');
                    }
                })
            }
        }
    }

    /**
     * Show fragment filters and hide menu
     * @returns {{restrict: string, link: link}}
     */
    function showFilters(){
        return {
            restrict:'A',
            link: function (scope, elem, attrs){

            }
        }
    }

    /**
     * Show fragment filters and hide menu
     * @returns {{restrict: string, link: link}}
     */
    function filtersSelection(){
        return {
            restrict:'A',
            link: function (scope, elem, attrs){
                elem.addClass('active');
                elem.on('click', function(){
                    elem.toggleClass('active');
                })
            }
        }
    }

})();