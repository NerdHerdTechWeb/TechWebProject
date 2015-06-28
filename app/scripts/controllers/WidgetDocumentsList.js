(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetDocumentsList', widgetDocumentsList)
        .directive('insertTab', mainArea)

    function widgetDocumentsList(documents, $scope, $window) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded = [];

        vm.documentEntries = [];

        documents.getDocuments().then(
            function (results) {
                vm.documentEntries = results;
            }, function (error) { // Check for errors
                console.log(error);
            }
        );

        $scope.getMainDocument = function (link, from, data) {
            documents.getDocument(link, from).then(
                function (results) {
                    vm.documentEntry = results;
                    mainDocAreaFiller(data, results);
                }, function (error) { // Check for errors
                    console.log(error);
                }
            );
        }
    }

    function mainArea() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var data = scope.$eval(attrs.insertTab);
                jQuery(element).on('click', function (event) {
                    scope.getMainDocument(data.documents.link, data.documents.from, data);
                });
            }
        }
    }

    function mainDocAreaFiller(data, results) {
        var id = '#mainDocArea';
        jQuery(id).append('<li role="presentation" class="active"><a href="">' + data.documents.title + '</a></li>');
    }
})(jQuery);