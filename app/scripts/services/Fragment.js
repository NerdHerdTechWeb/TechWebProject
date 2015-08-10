(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('fragment', fragment);

    function fragment($modal) {

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

        return {
            createFragment: createFragment
        }
    }

})();