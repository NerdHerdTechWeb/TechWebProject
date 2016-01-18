(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetFilters', widgetFilters);

    function widgetFilters($scope, $log) {
        $scope.isActive = true;
        $scope.filters = {
            hasAuthor:{
                Author: true,
                Autore: true,
                hasAuthor: true,
                default: true
            },
            hasPublicationYear: {
                PublicationYear: true,
                hasPublicationYear: true,
                default: true
            },
            hasTitle: {
                hasTitle: true,
                Title: true,
                Titolo: true,
                default: true
            },
            hasDOI: {
                hasDOI: true,
                DOI: true,
                default: true
            },
            hasURL: {
                hasURL: true,
                URL: true,
                default: true
            },
            hasComment: {
                hasComment: true,
                Comment: true,
                Commento: true,
                default: true
            },
            hasRethoric: {
                hasRethoric: true,
                Rhetoric: true,
                denotesRhetoric: true,
                default: true
            },
            hasCitations: {
                hasCitations: true,
                default: true
            },
            references: {
                references: true,
                default: true
            }
        };

        /**
         * true is for object equality
         */
        $scope.$watch('filters', function(newVal, oldVal){
            for(var key in newVal){
                if(newVal[key].default === false){
                    for(var k in newVal[key]){
                        $('span.'+k).each(function(){
                            $(this).removeClass(k);
                            $(this).addClass('not_'+k);
                        })
                    }
                }else{
                    for(var k in newVal[key]){
                        $('span.not_'+k).each(function(){
                            $(this).removeClass('not_'+k);
                            $(this).addClass(k);
                        })
                    }
                }
            }
        }, true);
    }
})();