(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('FragmentModal', fragmentModal);

    function fragmentModal($scope, $modalInstance, fragmentText) {

        $scope.fragmentText = fragmentText
        $scope.fragmentModel = fragmentText;
        $scope.inputSubject = fragmentText;
        $scope.fragment = {};

        $scope.annotationTypeLiteral = 'Choose Annotation'

        $scope.documentProperties = {
            hasAuthor: 'Author',
            hasDOI: 'DOI',
            hasPublicationYear: 'Publication Year',
            reference: 'Reference',
            hasTitle: 'Title',
            hasURL: 'URL'
        };

        $scope.type = 'hasTitle';


        $scope.tinymceOptions = {
            onChange: function (e) {
                // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins: 'advlist autolink link image lists charmap print preview',
            skin: 'lightgray',
            theme: 'modern'
        };

        $scope.ok = function () {
            //TODO save triple notation
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectType = function (type) {
            $scope.type = type;
            $scope.annotationTypeLiteral = $scope.documentProperties[type];
        }
    }
})();