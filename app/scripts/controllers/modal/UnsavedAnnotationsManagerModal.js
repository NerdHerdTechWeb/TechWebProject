(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UnsavedAnnotationsManagerModal', unsavedAnnotationsManagerModal);

    function unsavedAnnotationsManagerModal($scope, $modalInstance, $log, annotationManager) {

        $scope.rowCollection = annotationManager.getScrapedContent();
        $log.info($scope.rowCollection);

        $scope.removeRow = function removeRow(row, type) {

            switch (type) {
                case 'title' :
                    delete $scope.rowCollection.title;
                    break;
                case 'doi' :
                    delete $scope.rowCollection.doi;
                    break;
                case 'date' :
                    delete $scope.rowCollection.date;
                    break;
                case 'reference' :
                    var index = $scope.rowCollection.references.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.references.splice(index, 1);
                    }
                    break
                case 'author' :
                    var index = $scope.rowCollection.author.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.author.splice(index, 1);
                    }
                    break;
                case 'comment' :
                    var index = $scope.rowCollection.comment.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.comment.splice(index, 1);
                    }
                    break;
                case 'url' :
                    var index = $scope.rowCollection.url.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.url.splice(index, 1);
                    }
                    break;
            }
        }

        $scope.saveAll = function () {
            //TODO prepare collection
            //TODO call annotation service
        }

        $scope.removeAll = function () {
            $scope.rowCollection = null;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }
})();