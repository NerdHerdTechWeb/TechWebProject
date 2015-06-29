(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetDocumentsList', widgetDocumentsList)
        .directive('insertTab', mainArea)

    function widgetDocumentsList(documents, $scope, $window) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded =  [];

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
                    $scope.addItem(data, results);
                }, function (error) { // Check for errors
                    console.log(error);
                }
            );
        }

        $scope.addItem = function(data, results) {
            var resource = results[0];
            console.log(resource);
            var newItemNo = $scope.documentsLoaded.length + 1;
            $scope.documentsLoaded.push({
                title:'Document '+newItemNo,
                content: results[0].articleContent,
                keywords: results[0].keywords,
                authors: results[0].authors,
                citations: results[0].citations
            });
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
})(jQuery);