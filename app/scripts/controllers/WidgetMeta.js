/**
 * 
 * 
 */

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
                Notification.success('Metadata available');
                
                /*meta.getReadyGraph().then(function(results){
                    Notification.success('Metadata available');
                    search = [];
                    angular.forEach(results, function(value, key) {
                        var partial = String(value).match(pattern)
                        search.push(partial[0])
                    });
                    $scope.readyGraph = results;
                });*/
            });
        });
        
        $scope.$watch('graphList', function(newVal, oldVal){
            $scope.graph = [];
            angular.forEach($scope.graphList, function(v, k){
                //var pat = new RegExp(search[0]);
                //var matching = String(v).match(pat);
                var matching2 = String(v).match(/\/graph\/([a-zA-Z0-9]+)/);
                var needle = null;
                if(matching2)
                    needle = matching2[1] || null;
                //if(matching || matching2){
                $scope.graph.push({graph:v,group:needle});
                //}
            });
        });
        
        /*$scope.$watch('graphList', function(newVal, oldVal){
            $scope.graph = [];
            angular.forEach(search, function(value, key) {
                angular.forEach($scope.graphList, function(v, k){
                    var pat = new RegExp(search[0]);
                    var matching = String(v).match(pat);
                    var matching2 = String(v).match(/ltw1540/);
                    if(matching || matching2){
                        $scope.graph.push(v);
                    }
                });
            });
        });*/
        
        $scope.getDocument = function(link, from, data, event$, graph){
            $rootScope.$broadcast('getMainDocument',{'link':link, 'from':from, 'data':data, 'event':event$, 'graph':graph});
        }
    }
})();