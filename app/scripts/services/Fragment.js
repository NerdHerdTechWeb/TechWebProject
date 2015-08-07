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
            
            return text
            
            //TODO mem higlited text in document (triple subject)
            //TODO open editing modal
            
        }

        return {
            createFragment: createFragment
        }
    }

})();