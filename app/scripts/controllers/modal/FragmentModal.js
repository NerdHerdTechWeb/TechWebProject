(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('FragmentModal', fragmentModal);

    function fragmentModal($scope, $modalInstance, fragmentText) {

        $scope.fragmentText = fragmentText;
        $scope.fragmentModel = fragmentText;
        $scope.inputSubject = fragmentText;
        $scope.inputObject = '';

        
        $scope.tinymceOptions = {
            onChange: function(e) {
              // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins : 'advlist autolink link image lists charmap print preview',
            skin: 'lightgray',
            theme : 'modern'
         };
        
        $scope.ok = function () {
            //TODO save triple notation
            console.log($scope.fragmentModel);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();