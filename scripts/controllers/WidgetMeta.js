(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetMeta', widgetMeta);

    function widgetMeta(meta, $scope, $modal, $log, $window) {

        // vm is our capture variable
        var vm = this;

        vm.metaEntries = [];

        meta.getMeta().then(function(results) {
            vm.metaEntries = results;
            console.log(vm.metaEntries);
        }, function(error) { // Check for errors
            console.log(error);
        });

        $scope.items = ['item1', 'item2', 'item3'];
        $scope.open = function (size) {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/partials/modals/widgetMetaModal.html',
                controller: 'WidgetMetaModal',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
})();