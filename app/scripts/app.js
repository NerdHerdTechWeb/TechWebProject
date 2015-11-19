
(function ($, window) {

    $.fn.contextMenu = function (settings) {

        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;
                
                //open menu
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "fixed",
                        "z-index": "10000",
                        left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                    })
                    .off('click')
                    .on('click', 'a', function (e) {
                        $menu.hide();
                
                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);
                        
                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });
                
                return false;
            });

            //make sure menu closes on any click
            $(document).click(function () {
                $(settings.menuSelector).hide();
            });
        });
        
        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;
                        
            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse) 
                position -= menu;
            
            return position;
        }    

    };
})(jQuery, window);

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
            'frapontillo.bootstrap-switch',
            'ng-context-menu'
        ])
        .directive('lateralMenu', LateralMenu)
        .directive('showMenu', showMenu)
        .directive('showFilters', showFilters)
        .directive('filtersSelection', filtersSelection)
        .directive('createTextFragment', ['$compile', '$log', '$filter', 'Notification', 'fragment', 'user', function ($compile, $log, $filter, Notification, fragment, user) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                
                function getFirstRange() {
                    var sel = rangy.getSelection();
                    return sel.rangeCount ? sel.getRangeAt(0) : null;
                }
                
                function surroundRange() {
                    var range = getFirstRange();
                    if (range) {
                        if(rangy.getSelection().toString().length <= 0)
                            return;
                        var start = range.endContainer.parentNode.textContent.indexOf(rangy.getSelection().toString())
                        var end = start + (range.endOffset);
                        var localPath = fragment.createLocalXPATH(range.commonAncestorContainer.parentNode);
                        var remotePath = fragment.createRemoteXPATH(localPath);
                        var xpath = remotePath;
                        var text = rangy.getSelection().toString();
                        
                        
                        var span = document.createElement("span");
                        span.setAttribute('data-xpath', xpath);
                        span.setAttribute('data-start', start);
                        span.setAttribute('data-end', end);
                        span.setAttribute('data-annotation-id', end);
                        span.setAttribute('data-date', $filter('date')(Date.now(), 'yyyy-MM-dd'));
                        span.setAttribute('data-author', user.userData().email);
                        span.setAttribute('data-fragment-in-document', text);
                        span.setAttribute('data-fragment', text);
                        span.setAttribute('data-type', 'noType');
                        
                        span.setAttribute('tooltip', 'Fragment not saved yet. Click or right-click on it to edit');
                        span.setAttribute('tooltip-placement', 'top');
                        span.setAttribute('tooltip-trigger', 'mouseenter');
                        span.setAttribute('id', 'snap_' + Date.now());
                       
                        span.setAttribute('ng-click', 'showNotationModal($event)');
                        span.setAttribute('class', 'annotation noType');
                        
                        span.setAttribute('create-context-menu','');
                        
                        if (range.canSurroundContents(span)) {
                            range.surroundContents(span);
                            $compile(span)(scope);
                        } else {
                            Notification.warning("Unable to surround range because range partially selects a non-text node. See DOM4 spec for more information.");
                        }
                    }
                }
                
                scope.$on('getSelection', function(event, args){
                    surroundRange();
                });
            }
        };
    }])
    
    .directive('createContextMenu', ['$compile', '$log', '$filter', 'Notification', 'fragment', 'user', function ($compile, $log, $filter, Notification, fragment, user) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                jQuery(element).contextMenu({
                    menuSelector: "#contextMenu",
                    menuSelected: function (invokedOn, selectedMenu) {
                        var data = selectedMenu.data();
                        switch (data.action) {
                            case 'remove':
                                invokedOn.contents().unwrap();
                                break;
                            case 'edit':
                                invokedOn.trigger('click');
                                break;
                            case 'close':
                                //close
                                break;
                            
                            default:
                                // close
                        }
                    }
                });
            }
            
        }
    }])

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
                    redirectTo: '/annotator',
                    templateUrl: init_conf.partialsView + 'annotator.html'
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