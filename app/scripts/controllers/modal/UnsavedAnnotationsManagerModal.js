(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UnsavedAnnotationsManagerModal', unsavedAnnotationsManagerModal);

    function unsavedAnnotationsManagerModal($scope, $rootScope, $modalInstance, $log, Notification, $window, annotationManager) {
        
        /*$scope.rowCollection = [
            {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
            {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
        ];*/
        
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