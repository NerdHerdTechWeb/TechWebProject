(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('annotationManager', annotationManager);

    function annotationManager($window, $resource, $log, Notification, user) {

        var unsavedAnnotations = [];
        var lastAnnotationsUpdated = {};
        var Annotation = $resource('//' + $window.location.host + '/api/annotations/update', {},
            {
                update: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            });

        function create() {

        }

        function update(params) {
            if(!user.logInStatus()){
                Notification.error('You are not logged in');
                return;
            }
            return Annotation.update(jQuery.param(params)).$promise.then(function (results) {
                Notification.success('Annotations updated');
                lastAnnotationsUpdated = results;
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }

        function destroy() {

        }

        function search() {

        }

        function lastUpdated() {
            return lastAnnotationsUpdated;
        }

        return {
            create: create,
            update: update,
            destroy: destroy,
            search: search,
            lastUpdated: lastUpdated
        }
    }

})(jQuery);