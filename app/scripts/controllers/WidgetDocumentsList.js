(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetDocumentsList', widgetDocumentsList)
        .filter('unsafe', function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        })
        .directive('insertTab', mainArea)

    function widgetDocumentsList(documents, $scope, $timeout, $window) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded =  [];
        $scope.skCircle = jQuery('.sk-circle');

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
                    $scope.skCircle.removeClass('doc-preloader-show').addClass('doc-preloader-hide');
                }, function (error) { // Check for errors
                    console.log(error);
                }
            );
        }

        $scope.addItem = function(data, results) {
            var resource = results[0];
            var newItemNo = $scope.documentsLoaded.length + 1;
            $scope.documentsLoaded.push({
                title:'Document '+newItemNo,
                content: results[0].articleContent
            });
            
            $timeout(function(){replaceImgPath(data)}, 1000);
        }
    }
    
    function replaceImgPath(data){
        jQuery('#navTabsContainer img:not(.img-replaced)').each(function(i,el){
            var img = jQuery(this);
            var src = img.attr('src');
            img.attr('src',data.documents.imgpath+src);
            img.addClass('img-replaced');
        });
    }

    function mainArea() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var data = scope.$eval(attrs.insertTab);
                var documents = jQuery(element);
                
                if(data.documents.first){
                    scope.skCircle.removeClass('doc-preloader-hide').addClass('doc-preloader-show');
                    scope.getMainDocument(data.documents.link, data.documents.from, data);
                }
                /**
                 * Load documents by click
                 */
                documents.on('click', function (event) {
                    scope.skCircle.removeClass('doc-preloader-hide').addClass('doc-preloader-show');
                    scope.getMainDocument(data.documents.link, data.documents.from, data);
                });
            }
        }
    }
    
})(jQuery);