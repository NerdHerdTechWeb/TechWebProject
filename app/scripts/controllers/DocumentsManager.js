(function (jQuery,window) {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('DocumentsManager', documentsManager)
        .filter('unsafe', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        })
        //.directive('insertTab', mainArea)
        .directive('createLocalPath', CreateLocalPath)
        .directive('createLocalPathFromRemote', CreateLocalPathFromRemote)
        .directive('createFragmentSpan', ['$compile','$rootScope', function($compile){
            return {
                restrict: 'A',
                link: function (scope, element, attrs){
                    scope.$watch('spanInjected',function(){
                        //$compile(element.contents())(scope);
                        console.log('sti cazzi');
                    });
                }
            }
        }]);

    /**
     *
     * @param documents
     * @param fragment
     * @param $scope
     * @param $timeout
     * @param $window
     * @param $modal
     * @param $compile
     */
    function documentsManager(documents, fragment, $scope, $timeout, $window, $modal, $compile) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded = [];
        $scope.skCircle = jQuery('.sk-circle');
        $scope.fragmentText = '';
        $scope.spanInjected = false;

        $scope.documentEntries = [];

        documents.getDocuments().then(
            function (results) {
                $scope.documentEntries = results;
            }, function (error) { // Check for errors
                console.log(error);
            }
        );

        $scope.showNotationModal = function(event){
            console.log(event);
        }

        $scope.getMainDocument = function (link, from, data, event$) {
            $scope.skCircle.removeClass('doc-preloader-hide').addClass('doc-preloader-show');
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
            $scope.documentData = data;
            $scope.documentsLoaded.push({
                title: data.label,
                hoverTitle: data.label,
                documentId: data.documentId,
                content: results[0].articleContent
            });

        }

        $scope.$watch('documentsLoaded',function(){
            $scope.loadAnnotations($scope.documentData.link);
        });

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
            return fragment.loadAnnotations({
                source: source,
                graph: 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525'
            }).then(function(results){
                jQuery('tr').unwrap('tbody');
                jQuery('#navTabsContainer img:not(.img-replaced)').each(function (i, el) {
                    var img = jQuery(this);
                    var src = img.attr('src');
                    img.attr('src', $scope.documentData.imagepath + src);
                    img.addClass('img-replaced');
                });
                var rLe = results.length;
                for(var key in results){
                    if(key < rLe)
                        results[key].localPath = fragment.createLocalPathFromRemote(results[key].start);
                }
                fragment.hilightFragment(results, $scope, $compile);
            });
        }
    }

    /**
     *
     * @param data
     * @param $scope
     */
    function postDocumentLoad(data, $scope) {
        jQuery('tr').unwrap('tbody');
        jQuery('#navTabsContainer img:not(.img-replaced)').each(function (i, el) {
            var img = jQuery(this);
            var src = img.attr('src');
            img.attr('src', data.imagepath + src);
            img.addClass('img-replaced');
        });
        $scope.loadAnnotations(data.link);
        //jQuery('#document_' + data.documents.documentId).toggleClass('disabled');
    }

    /**
     *
     * @returns {{restrict: string, link: Function}}
     * @constructor
     */
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

    /**
     *
     * @returns {{restrict: string, link: Function}}
     * @constructor
     */
    function CreateLocalPathFromRemote() {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {

            }
        }
    }


})(jQuery,window);