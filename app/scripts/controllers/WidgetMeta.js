(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('WidgetMeta', widgetMeta);

    function widgetMeta(meta, $scope, $modal, $log, Notification, $rootScope) {
        
        var pattern = /ltw[\d]+/;
        var search = [];
        $scope.graphList = [];
        $scope.readyGraph = [];
        $scope.graph = [];
        $scope.documentData = {};
        
        $scope.$on('loadMeta',function(event,data){
              $scope.documentData = {
                'label': data.label,
                'link': data.link,
                'imagepath': data.imagepath,
                'from': data.from,
                'group': 'TheScraper'
            }
            meta.getAvailableGraph().then(function(results){
                Notification.warning('Loading meta data...');
                $scope.graphList = results;
                
                meta.getReadyGraph().then(function(results){
                    Notification.success('Metadata available');
                    var log = [];
                    search = [];
                    angular.forEach(results, function(value, key) {
                        var partial = String(value).match(pattern)
                        search.push(partial[0])
                    });
                    $scope.readyGraph = results;
                });
            });
        });
        
        $scope.$watch('readyGraph', function(newVal, oldVal){
            var log = [];
            $scope.graph = [];
            angular.forEach(search, function(value, key) {
                angular.forEach($scope.graphList, function(v, k){
                    var pat = new RegExp(search[0]);
                    var matching = String(v).match(pat);
                    if(matching){
                        $scope.graph.push(v)
                    }
                });
            }, log);
        });
        
        $scope.getDocument = function(link, from, data, event$, graph){
            $rootScope.$broadcast('getMainDocument',{'link':link, 'from':from, 'data':data, 'event':event$, 'graph':graph});
        }
    }
})();