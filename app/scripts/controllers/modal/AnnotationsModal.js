(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('AnnotationsModal', annotationsModal);

    function annotationsModal($scope, $modalInstance, $log, $modal, fragmentText, user) {
        
        var ct = jQuery(fragmentText.currentTarget);
        
        $scope.logInStatus = user.logInStatus();
        $scope.switchLoginView = false;
        
        $scope.documentProperties = {
            hasAuthor: 'Author',
            hasDOI: 'DOI',
            hasPublicationYear: 'Publication Year',
            references: 'Reference',
            hasTitle: 'TItle',
            hasURL: 'URL'
        };
        
        $scope.fragmentProperties = {
            hasCitation: 'Citation',
            hasComment: 'Comment',
            hasRethoric: 'Rethoric'
        };

        $scope.documentAType = {};
        $scope.documentAType.type = ct.data('type');
        $scope.documentAType.subject = ct.data('fragment');
        $scope.documentAType.author = $scope.documentAType.type == 'hasAuthor' ? ct.data('fragment') : '';
        $scope.documentAType.doi = $scope.documentAType.type == 'hasDOI' ? ct.data('fragment') : '';
        $scope.documentAType.publicationYear = $scope.documentAType.type == 'hasPublicationYear' ? ct.data('fragment') : '';
        $scope.documentAType.references = $scope.documentAType.type == 'references' ? ct.data('fragment') : '';
        $scope.documentAType.title = $scope.documentAType.type == 'hasTitle' ? ct.data('fragment') : '';
        $scope.documentAType.url = $scope.documentAType.type == 'URL' ? ct.data('fragment') : '';
        
        $scope.fragmentAType = {};
        $scope.fragmentAType.type = ct.data('type');
        $scope.fragmentAType.citation = $scope.fragmentAType.citation == 'hasCitation' ? ct.data('fragment') : '';
        $scope.fragmentAType.comment = $scope.fragmentAType.comment == 'hasComment' ? ct.data('fragment') : '';

        $scope.annotationTypeLiteral = $scope.documentProperties[$scope.documentAType.type] || 'Author'
        $scope.annotationFragmentTypeLiteral = $scope.fragmentProperties[$scope.fragmentAType.type] || 'Citation';
        
        $scope.dat = $scope.documentAType.type;
        $scope.fat = $scope.fragmentAType.type;

        $scope.ok = function () {
            //TODO save triple notation
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectDocumentAType = function(type){
            $scope.dat = type;
            $scope.annotationTypeLiteral = $scope.documentProperties[type];
        }
        
        $scope.selectFragmentAType = function(type){
            $scope.fat = type;
            $scope.annotationFragmentTypeLiteral = $scope.fragmentProperties[type];
        }
        
        $scope.login = function (){
            $scope.switchLoginView = true;
        }
        
        $scope.doLogin = function (){
            user.login();
            $scope.logInStatus = user.logInStatus();
            $scope.switchLoginView = false;
        }
        
        $scope.$on('logInEvent', function (event, args){
            $scope.logInStatus = user.logInStatus();
        });
    }
})();