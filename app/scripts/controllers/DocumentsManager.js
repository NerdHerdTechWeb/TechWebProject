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
        .directive('createFragmentSpan', CreateFragmentSpan)

    function documentsManager(documents, annotationManager, fragment, $scope, $timeout, $window, $modal, $compile, $log) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded = [];
        $scope.skCircle = jQuery('.sk-circle');
        $scope.fragmentText = '';

        $scope.documentEntries = [];

        documents.getDocuments().then(
            function (results) {
                $scope.documentEntries = results;
            }, function (error) { // Check for errors
                $log.error(error);
            }
        );
        
        $scope.$on('documentFiltered', function(event, args){
            $scope.documentEntries = [];
            var tempRes = [];
            for(var k in args){
                var argJ = typeof args[k].toJSON === 'function' ? args[k].toJSON() : false;

                if(argJ) tempRes.push({
                    'label': argJ.label,
                    'link': argJ.link,
                    'imagepath': argJ.imagepath,
                    'from': argJ.from
                });
            }
            $scope.documentEntries = tempRes;
        });

        $scope.showNotationModal = function(event){
            /**
             * Increment paginator counter
             */
            annotationManager.setModalsPaginatorCount();

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/app/partials/modals/annotationModal.html',
                controller: 'AnnotationsModal',
                size: 'lg',
                resolve: {
                    fragmentText: function () {
                        return event;
                    }
                }
            });
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
            typeof $scope.documentData !== 'undefined' ? $scope.loadAnnotations($scope.documentData.link) : '';
        });
        
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
    
    function CreateFragmentSpan(){
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                scope.$watch(element.html(), function(){
                    console.log(element);
                });
            }
        }
    }


})(jQuery,window);