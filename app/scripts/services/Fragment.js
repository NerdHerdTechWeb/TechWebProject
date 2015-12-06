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
    function fragment($modal, $http, $resource, $compile, $log) {

        var dlibRootPath = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]';
        var statistRoothPath = '/html/body/div[1]/div[2]/div[2]';
        
        String.prototype.hashCode = function() {
            var hash = 0, i, chr, len;
            if (this.length == 0) return hash;
            for (i = 0, len = this.length; i < len; i++) {
                chr   = this.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        
        /**
         *  Return hashed string
         */
        function hash(stringToHash){
            return String(stringToHash).hashCode();
        }

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
        function createLocalPathFromRemote (remotePath, from){
            var str = remotePath;
            //TODO check if dLib or not
            var splitting = str.split('/');
            var needle,
                joined,
                local;
            if(from === 'dlib'){
                needle = splitting.splice(10);
                joined = needle.join('/');
                local = xpath_conf.dLibLocal + joined;
            }
            if(from === 'rstat'){
                needle = splitting.splice(7);
                joined = needle.join('/');
                local = xpath_conf.rivistaStatLocal + joined;
            }
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

        /**
         *
         * @param annotations
         * @param scope$
         * @param compile$
         */
        function hilightFragment (annotations, scope$, compile$){
            var equals = [];
            var hashedObj = {};
            for(var key in annotations){
                if(annotations[key].watf !== ''){
                    var r = document.createRange();
                    if(annotations[key].start !== ''){
                        var lc = $(document.evaluate(annotations[key].localPath,
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                            .singleNodeValue)[0];
                            
                        var hash = this.hash(annotations[key].startoffset+annotations[key].endoffset+annotations[key].start);

                        render_fragment(lc,
                            annotations[key].startoffset,
                            annotations[key].endoffset,
                            annotations[key].start,
                            annotations[key],
                            scope$, equals, hash);
                        
                    }
                }
            }
        }

        /**
         * Renderizza il frammento di testo tramite una cascata
         * condizionale. Se il frammento non è valido non sarà mostrato a schermo
         * Internal us
         * @param node
         * @param start
         * @param end
         * @param xpath
         * @param annotation
         * @param scope$
         * @returns {Range|TextRange}
         */
        function render_fragment(node, start, end, xpath, annotation, scope$, equals, hash) {
            var range = document.createRange();
            if(!node) return;
            //if(start >400) return;
            if(xpath === dlibRootPath ) return;
            while (node.nodeType != 3)
                if(node.firstChild) node = node.firstChild;
                else return;
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
                        /* non permette sovrapposizioni tra span - chiusere html sbagliate */
                        if(node === null) return
                    }
                }
            }

            range.setStart(node, start);
            if (node.length < end) {
                range.setEnd(node, node.length);
                if (node.nextSibling != null && node.nextSibling.nodeType == 8)
                    node = node.nextSibling;
                if (node.nextSibling == null) {
                    render_fragment(node.parentNode.nextSibling, 0, (end - node.length), xpath, annotation, scope$, equals, hash);
                } else {
                    render_fragment(node.nextSibling, 0, (end - node.length), xpath, annotation, scope$, equals, hash);
                }
            } else {
                range.setEnd(node, end);
            }

            var annotationColor = typeof annotation !== 'undefined' ? annotation.wtf : 'genericAnnotation';
            var span = document.createElement('span');
            span.setAttribute('data-xpath', xpath);
            span.setAttribute('data-start', start);
            span.setAttribute('data-end', end);
            //span.setAttribute('data-annotation-id', end);
            span.setAttribute('data-date', annotation.date);
            span.setAttribute('data-author', annotation.author);
            span.setAttribute('data-fragment-in-document', range.toString());
            span.setAttribute('data-fragment', annotation.o_label || annotation.o);
            span.setAttribute('data-type', annotationColor);
            span.setAttribute('data-equals', "{'init':"+equals.init+", 'final':"+equals.final+"}");
            span.setAttribute('ng-click', 'showNotationModal($event); $event.stopPropagation()');
            span.setAttribute('class', 'annotation ' + annotationColor);
            
            span.setAttribute('tooltip', 'Click or right-click on it to edit');
            span.setAttribute('tooltip-placement', 'top');
            span.setAttribute('tooltip-trigger', 'mouseenter');
            span.setAttribute('id', 'snap_' + Date.now());
            span.setAttribute('data-hash', 'hash_' + hash);
            
            //span.setAttribute('create-context-menu','');
            
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
            hash: hash
        }
    }

})();