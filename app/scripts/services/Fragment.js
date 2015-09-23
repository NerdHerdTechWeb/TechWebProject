(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('fragment', fragment);

    /**
     *
     * @param $modal
     * @param $http
     * @param $resource
     * @param $compile
     * @returns {{createFragment: createFragment, createLocalXPATH: createLocalXPATH, createRemoteXPATH: createRemoteXPATH, createLocalPathFromRemote: createLocalPathFromRemote, loadAnnotations: loadAnnotations, hilightFragment: hilightFragment}}
     */
    function fragment($modal, $http, $resource, $compile) {

        var dlibRootPath = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]';


        /**
         *
         * @param event$
         * @returns {string}
         */
        function createFragment(event$) {

            var range = {};
            var startOffset = 0;
            var endOffset = 0;
            /**
             * Get selected text
             */
            var text = "";
            if (typeof window.getSelection !== 'undefined') {
                text = window.getSelection().toString();
                range = window.getSelection().getRangeAt(0);
                startOffset = range.startOffset;
                endOffset = range.endOffset
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }

            /**
             * Open the modal if something has been matched
             */
            var fragmentText = text,
                re = /[a-zA-Z]+/i,
                str = fragmentText,
                m;
            if ((m = re.exec(str)) !== null) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/app/partials/modals/fragmentModal.html',
                    controller: 'FragmentModal',
                    size: 'lg',
                    resolve: {
                        fragmentText: function () {
                            return fragmentText;
                        }
                    }
                });
            }

            return text;
        }

        /**
         * Create XPATH from contained fragment element
         * @param element | jquery target
         * @returns {string}
         */
        function createLocalXPATH(element) {
            if (element.id !== '')
                return 'id("' + element.id + '")';
            if (element === document.body)
                return element.tagName;

            var ix = 0;
            var siblings = element.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (sibling === element)
                    return createLocalXPATH(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                    ix++;
            }
        }

        /**
         *
         * @param localPath
         * @param remoteRootXPATH
         * @returns {string}
         */
        function createRemoteXPATH(localPath, remoteRootXPATH) {
            var str = localPath;
            //TODO check if dLib or not
            var splitting = str.split('/');
            var needle = splitting.splice(5);
            var joined = needle.join('/');
            var remote = String(xpath_conf.dLib + joined).toLocaleLowerCase();
            return remote;
        }

        /**
         *
         * @param remotePath
         * @param localRootPath
         * @returns {string}
         */
        function createLocalPathFromRemote (remotePath, localRootPath){
            var str = remotePath;
            //TODO check if dLib or not
            var splitting = str.split('/');
            var needle = splitting.splice(10);
            var joined = needle.join('/');
            var local = xpath_conf.dLibLocal + joined;
            return local;
        }

        /**
         *
         * @param params
         * @returns {*}
         */
        function loadAnnotations (params){
            var Annotations = $resource('//'+window.location.host+'/api/annotations/get.json',{source:params.source,graph:params.graph});
            return Annotations.query().$promise.then(function(results) {
                return results;
            }, function(error) {
                // Check for errors
                console.log(error);
            });
        }
        
        function openAnnotationsModal(event){
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

        /**
         *
         * @param annotations
         * @param scope$
         * @param compile$
         */
        function hilightFragment (annotations, scope$, compile$){
            for(var key in annotations){
                var equals = false;
                if(annotations[key].watf != ''){
                    var r = document.createRange();
                    if(annotations[key].start !== ''){
                        var lc = $(document.evaluate(annotations[key].localPath,
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                            .singleNodeValue)[0];

                        if(key >= 1){
                            var kk = key-1;
                            while(kk >= 0){
                                if(annotations[key].startoffset == annotations[kk].startoffset){
                                    if(annotations[key].endoffset == annotations[kk].endoffset)
                                        if(annotations[key].start == annotations[kk].start){

                                        }
                                }
                                kk--;
                            }
                        }

                        if(!equals)
                            render_fragment(lc,annotations[key].startoffset,annotations[key].endoffset, annotations[key].start, annotations[key],scope$);
                    }
                }
            }
        }

        /**
         *
         * @param node
         * @param start
         * @param end
         * @param xpath
         * @param annotation
         * @param scope$
         * @returns {Range|TextRange}
         */
        function render_fragment(node, start, end, xpath, annotation, scope$) {
            var range = document.createRange();
            if(!node) return;
            //if(start >400) return;
            //if(xpath === dlibRootPath ) return;
            while (node.nodeType != 3)
                if(node.firstChild) node = node.firstChild;
                else return
            while (node.length < start) {
                start -= node.length;
                end -= node.length;
                if (node.nextSibling !== null && node.nextSibling.nodeType == 8){
                    node = node.nextSibling;
                }
                if (node.nextSibling === null) {
                    node = node.parentNode.nextSibling;
                } else if(node.nextSibling.nodeName === 'BR'){
                    while(node.nextSibling.nodeName === 'BR')
                        node = node.nextSibling;
                    if(node.nextSibling)
                        node = node.nextSibling;
                }else {
                    if(!node.length && node.nextSibling.nodeName === 'SPAN'){
                        var validLength = false;
                        while(!validLength){
                            node = node.nextSibling;
                            if(!node.firstChild){
                                node = node.nextSibling;
                            }
                            if(node.firstChild)
                                validLength = true;
                        }
                        if(node.nextSibling)
                            node = node.nextSibling;
                    }else{
                        node = node.nextSibling.firstChild;
                    }
                }
            }

            range.setStart(node, start);
            if (node.length < end) {
                range.setEnd(node, node.length);
                if (node.nextSibling != null && node.nextSibling.nodeType == 8)
                    node = node.nextSibling;
                if (node.nextSibling == null) {
                    render_fragment(node.parentNode.nextSibling, 0, (end - node.length), xpath, annotation, scope$);
                } else {
                    render_fragment(node.nextSibling, 0, (end - node.length), xpath, annotation, scope$);
                }
            } else {
                range.setEnd(node, end);
            }

            var annotationColor = typeof annotation !== 'undefined' ? annotation.watf : 'genericAnnotation';
            var span = document.createElement('span');
            span.setAttribute('data-xpath', xpath);
            span.setAttribute('data-start', start);
            span.setAttribute('data-end', end);
            span.setAttribute('data-annotation-id', end);
            span.setAttribute('data-date', annotation.date);
            span.setAttribute('data-author', annotation.author);
            span.setAttribute('data-fragment', range.toString());
            span.setAttribute('data-type', annotationColor);
            span.setAttribute('ng-click', 'showNotationModal($event)');
            span.setAttribute('class', 'annotation ' + annotationColor);
            range.surroundContents(span);
            $compile(span)(scope$);
            return range;
        }

        return {
            createFragment: createFragment,
            createLocalXPATH: createLocalXPATH,
            createRemoteXPATH: createRemoteXPATH,
            createLocalPathFromRemote: createLocalPathFromRemote,
            loadAnnotations: loadAnnotations,
            hilightFragment: hilightFragment,
            openAnnotationsModal: openAnnotationsModal
        }
    }

})();