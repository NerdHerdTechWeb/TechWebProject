(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UnsavedAnnotationsManagerModal', unsavedAnnotationsManagerModal);

    function unsavedAnnotationsManagerModal($scope, $modalInstance, $log, annotationManager) {
        
        $scope.rowCollection = annotationManager.getScrapedContent();
        $log.info($scope.rowCollection);

        $scope.removeRow = function removeRow(row) {
            var index = $scope.rowCollection.indexOf(row);
            if (index !== -1) {
                $scope.rowCollection.splice(index, 1);
            }
        }
        
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }
    }
})();