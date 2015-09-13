(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('DocumentsManager', documentsManager)
        .filter('unsafe', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        })
        .directive('insertTab', mainArea)
        .directive('createLocalPath', CreateLocalPath)
        .directive('createLocalPathFromRemote', CreateLocalPathFromRemote)

    function documentsManager(documents, fragment, $scope, $timeout, $window, $modal) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded = [];
        $scope.skCircle = jQuery('.sk-circle');
        $scope.fragmentText = '';

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

        $scope.addItem = function (data, results) {
            var resource = results[0];
            var newItemNo = $scope.documentsLoaded.length + 1;
            $scope.documentsLoaded = [];
            $scope.documentsLoaded.push({
                title: data.documents.title,
                hoverTitle: data.documents.title,
                documentId: data.documents.documentId,
                content: results[0].articleContent
            });

            $timeout(function () {
                postDocumentLoad(data, $scope)
            }, 1000);
        }

        $scope.removeTab = function (index, documentId) {
            //jQuery('#document_' + documentId).toggleClass('disabled');
            $scope.documentsLoaded.splice(index, 1);
        };

        $scope.showSelectedText = function (event$) {
            $scope.fragmentText = fragment.createFragment(event$);
        }

        $scope.createLocalXPATH = function (element$) {
            return fragment.createLocalXPATH(element$);
        }

        $scope.createRemotePath = function (localPath) {
            return fragment.createRemoteXPATH(localPath);
        }

        $scope.createLocalPathFromRemote = function (remotePath) {
            return fragment.createLocalPathFromRemote(remotePath);
        }

        $scope.loadAnnotations = function (source) {
            return fragment.loadAnnotations(source);
        }

        $scope.hilightFragment = function (annotations) {
            fragment.hilightFragment(annotations);
        }
    }

    /**
     * Replaces all src after document is loaded
     */
    function postDocumentLoad(data, $scope) {
        jQuery('tr').unwrap('tbody');
        jQuery('#navTabsContainer img:not(.img-replaced)').each(function (i, el) {
            var img = jQuery(this);
            var src = img.attr('src');
            img.attr('src', data.documents.imgpath + src);
            img.addClass('img-replaced');
        });
        $scope.loadAnnotations(data.documents.link);
        //jQuery('#document_' + data.documents.documentId).toggleClass('disabled');
    }

    /**
     * Main document area directive
     * All selected documents will be loaded here
     */
    function mainArea() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var data = scope.$eval(attrs.insertTab);
                var documents = jQuery(element);

                /*if(data.documents.first){
                 scope.skCircle.removeClass('doc-preloader-hide').addClass('doc-preloader-show');
                 scope.getMainDocument(data.documents.link, data.documents.from, data);
                 }*/
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

    function CreateLocalPath() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                jQuery(document).on('click', '#navTabsContainer .table-responsive .table',
                    function (event) {
                        var localPath = scope.createLocalXPATH(event.target);
                        var remotePath = scope.createRemotePath(localPath);
                        console.log(remotePath);
                    });
            }
        }
    }

    function CreateLocalPathFromRemote() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {

            }
        }
    }

})(jQuery);