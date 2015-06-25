(function(jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetDocumentsList', widgetDocumentsList)
        .directive('insertTab', mainArea)

    function widgetDocumentsList(documents, $scope, $window) {

        // vm is our capture variable
        var vm = this;

        vm.documentEntries = [];

        documents.getDocuments().then(function(results) {
            vm.documentEntries = results;
            console.log(vm.documentEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });
    }

    function mainArea(){
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var id = '#mainDocArea';
                jQuery(element).on('click',function(event){
                    jQuery(id).append(' <li role="presentation" class="active"><a href>Document 1</a></li>');
                });
            }
        };
    }
})(jQuery);