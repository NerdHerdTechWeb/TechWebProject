(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('AnnotationsModal', annotationsModal);

    function annotationsModal($scope, $modalInstance, fragmentText) {
        
        var ct = jQuery(fragmentText.currentTarget);
        
        $scope.documentProperties = {
            hasAuthor: 'Author',
            hasDOI: 'DOI',
            hasPublicationYear: 'Publication Year',
            reference: 'Reference',
            hasTitle: 'TItle',
            hasURL: 'URL',
        };

        $scope.fragment = {};
        $scope.fragment.type = ct.data('type');
        $scope.fragment.subject = ct.data('fragment');
        $scope.fragment.author = $scope.fragment.type == 'hasAuthor' ? ct.data('fragment') : '';
        $scope.fragment.doi = $scope.fragment.type == 'hasDOI' ? ct.data('fragment') : '';
        $scope.fragment.publicationYear = $scope.fragment.type == 'hasPublicationYear' ? ct.data('fragment') : '';
        $scope.fragment.reference = $scope.fragment.type == 'reference' ? ct.data('fragment') : '';
        $scope.fragment.title = $scope.fragment.type == 'hasTitle' ? ct.data('fragment') : '';
        $scope.fragment.url = $scope.fragment.type == 'URL' ? ct.data('fragment') : '';

        $scope.annotationTypeLiteral = $scope.documentProperties[$scope.fragment.type]

        $scope.type = $scope.fragment.type;

        $scope.ok = function () {
            //TODO save triple notation
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectType = function(type){
            $scope.type = type;
            $scope.annotationTypeLiteral = $scope.documentProperties[type];
        }
    }
})();