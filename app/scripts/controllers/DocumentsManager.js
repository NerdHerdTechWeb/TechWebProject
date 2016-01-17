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
        .directive('switchIndex', switchIndex)

    function documentsManager(documents, Notification, annotationManager, fragment, $scope, $rootScope,$modal, $compile, $log) {

        // vm is our capture variable
        var vm = this;
        $scope.documentsLoaded = [];
        $scope.skCircle = jQuery('.sk-circle');
        $scope.fragmentText = '';
        
        var documentDataLink = '';
        var documentDataImagePath = '';
        var documentDataGraph = '';
        var documentDataFrom = ''; 
        
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

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
        

        /**
         * Show annotation modal(s) 
         */
        $scope.annotationModalOpened = 0;
        
        $scope.showNotationModal = function(event){
            /**
             * Increment paginator counter
             */
            //annotationManager.setModalsPaginatorCount();
            
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
            
            $scope.annotationModalOpened++;

            /**
             * Manages modals annotation index/pagination 
             */
            /*modalInstance.rendered.then(function(){
                $rootScope.$broadcast('modal-index-switch');
            });*/
        }

        $scope.getMainDocument = function (link, from, data, event$, graph) {
            $scope.skCircle.removeClass('doc-preloader-hide').addClass('doc-preloader-show');
            documents.getDocument(link, from).then(
                function (results) {
                    /** Cleaning saved/scraped annotations **/
                    annotationManager.removeAllLocalAnnotations();
                    vm.documentEntry = results;
                    $scope.addItem(data, results, graph);
                    $scope.skCircle.removeClass('doc-preloader-show').addClass('doc-preloader-hide');
                }, function (error) {
                    Notification.error('Something goes wrong');
                    $log.error(error);
                }
            );
        }
        
        $scope.$on('getDocumentFromSearchField',function(event, link){
            var graph = graph || 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540';
            var regex = /journals|dlib|rivista-statistica/g;
            var m = String(link).match(regex);
            var from = 'dlib';
            if(m)
                from = m[0];
                
            var spl = String(link).split('/');
            spl.splice(-1,1);
            var imagepath = spl.join('/') + '/';
            
            documentDataFrom = from === 'rivista-statistica' ? 'rstat' : from;
            documentDataImagePath = imagepath;
            documentDataLink = link;
            documentDataGraph = graph;
            var data = {
                from: documentDataFrom,
                imagepath: imagepath,
                label: '',
                link: link
            }
            $scope.getMainDocument(link, documentDataFrom, data, null, graph);
        });

        $scope.addItem = function (data, results, graph) {
            var resource = results[0];
            var newItemNo = $scope.documentsLoaded.length + 1;
            $scope.graph = graph;
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
            typeof $scope.documentData !== 'undefined' ? $scope.loadAnnotations(
                $scope.documentData.link || documentDataLink, 
                $scope.graph || documentDataGraph,
                $scope.documentData.from || documentDataFrom) : '';
            $rootScope.$broadcast('loadMeta',$scope.documentData);
        });
        
        $scope.$on('getMainDocument', function(event, args){
            $scope.getMainDocument(args.link, args.from, args.data, args.event, args.graph);
        });
        
        $scope.loadAnnotations = function (source, graph, from) {
            return fragment.loadAnnotations({
                source: source,
                graph: graph || 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540'
            }).then(function(results){
                jQuery('tr').unwrap('tbody');
                jQuery('#navTabsContainer img:not(.img-replaced)').each(function (i, el) {
                    var img = jQuery(this);
                    var src = img.attr('src');
                    img.attr('src', $scope.documentData.imagepath + src);
                    img.addClass('img-replaced');
                });
                var rLe = results.length;
                /** Make auto scraping only on 1540 **/
                if(rLe <= 0 && (graph.match(/\/graph\/ltw1540/) || graph === '')){
                    $rootScope.$broadcast('noAnnotationsFounded', $scope.documentData.link);
                }
                for(var key in results){
                    if(key < rLe)
                        results[key].localPath = fragment.createLocalPathFromRemote(results[key].start, from);
                }
                fragment.hilightFragment(results, $scope, $compile);
            });
        }

        $scope.showSelectedText = function (event$) {
            $rootScope.$broadcast('getSelection');
            //$scope.fragmentText = fragment.createFragment(event$);
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
                        console.log(localPath);
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
    
    /**
     * Listen on switch index event on madal  
     */
    function switchIndex(){
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                scope.$on('modal-index-switch', function(event, args){
                    $('div.modal').each(function(i,el){
                        $(el).addClass('zIndex_'+(i+1)); 
                    });
                });
                scope.$on('change-modal-page', function(event, args){
                    var index = args.pageIndex;
                    var previewsIndex = $(document).data('previews-z-index');
                    /**
                     * If prev Index exists the app 
                     * resets the original index onto the original element
                     */
                    if(previewsIndex)
                        $('div.zIndex_'+previewsIndex.index).css('z-index',previewsIndex.val);
                        
                    $(document).data('previews-z-index',{"index":index,"val":$('div.zIndex_'+index).css('z-index')});
                    
                    //TODO makes z-index dynamic
                    $('div.zIndex_'+index).css('z-index', 1500);
                });
            }
        }
    }


})(jQuery,window);