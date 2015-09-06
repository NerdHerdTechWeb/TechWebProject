(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('fragment', fragment);

    function fragment($modal,$http) {

        function createFragment(event$) {

            /**
             * Get selected text
             */
            var text = "";
            if (typeof window.getSelection !== 'undefined') {
                text = window.getSelection().toString();
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

        function createRemoteXPATH(localPath, remoteRootXPATH) {
            var str = localPath;
            //TODO check if dLib or not
            var splitting = str.split('/');
            var needle = splitting.splice(5);
            var joined = needle.join('/');
            var remote = String(xpath_conf.dLib + joined).toLocaleLowerCase();
            return remote;
        }

        function createLocalPathFromRemote (remotePath, localRootPath){
            var str = remotePath;
            //TODO check if dLib or not
            var splitting = str.split('/');
            var needle = splitting.splice(10);
            var joined = needle.join('/');
            var local = xpath_conf.dLibLocal + joined;
            return local;
        }

        function loadAnnotations (documentSource){
            var payload = $.param({
                source: documentSource,
                graph: 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525'
            });
            var config = { headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}}

            $http.post('//'+window.location.host+'/api/annotations/get.json', payload, config)
                .then(function(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    var data = response.data;
                    for(var key in data){
                        data[key].localPath = createLocalPathFromRemote(data[key].start);
                    }

                    hilightFragment(data);

                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                })
        }

        function hilightFragment (annotations){
            for(var key in annotations){
                $(document.evaluate(annotations[key].localPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                    .singleNodeValue).css('color','red');
            }
        }

        return {
            createFragment: createFragment,
            createLocalXPATH: createLocalXPATH,
            createRemoteXPATH: createRemoteXPATH,
            createLocalPathFromRemote: createLocalPathFromRemote,
            loadAnnotations: loadAnnotations,
            hilightFragment: hilightFragment
        }
    }

})();