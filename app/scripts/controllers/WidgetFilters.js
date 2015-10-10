(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetFilters', widgetFilters);

    function widgetFilters($scope, $log) {
        $scope.isActive = true;
        $scope.filters = {
            hasAuthor: true,
            hasPublicationYear: true,
            hasTitle: true,
            hasDOI: true,
            hasURL: true,
            hasComment: true,
            hasRethoric: true,
            hasCitations: true,
            references: true
        };

        /**
         * true is for object equality
         */
        $scope.$watch('filters', function(newVal, oldVal){
            for(var key in newVal){
                if(newVal[key] === false){
                    $('span.'+key).each(function(){
                        $(this).removeClass(key);
                        $(this).addClass('not_'+key);
                    })
                }else{
                    $('span.not_'+key).each(function(){
                        $(this).removeClass('not_'+key);
                        $(this).addClass(key);
                    })
                }
            }
        }, true);
    }
})();