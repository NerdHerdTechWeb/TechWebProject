(function (jQuery) {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('annotationManager', annotationManager);

    /**
     * Main annotations manage methods
     * @param $window
     * @param $resource
     * @param $log
     * @param Notification
     * @param user
     * @returns {{create: create, update: update, destroy: destroy, search: search, lastUpdated: lastUpdated}}
     */
    function annotationManager($window, $resource, $log, Notification, user) {

        var lastAnnotationsUpdated = {};
        var modalsCount = 0;
        var scrapingStorage = {};

        var Annotation = $resource('//' + $window.location.host + '/api/annotations/update', {},
            {
                update: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                },
                create: {
                    method: 'POST',
                    url: '//' + $window.location.host + '/api/annotations/create',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                },
                destroy: {
                    method: 'POST',
                    url: '//' + $window.location.host + '/api/annotations/destroy',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                },
                search: {
                    method: 'POST',
                    url: '//' + $window.location.host + '/api/annotations/search',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                },
                scraping: {
                    method: 'POST',
                    url: '//' + $window.location.host + '/api/scraping/document',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    isArray: false
                }
            });

        /**
         * Create annotation on sparql
         * @param params
         * @returns {*}
         */
        function create(params) {
            if (!user.logInStatus()) {
                Notification.error('You are not logged in');
                return;
            }
            return Annotation.create(jQuery.param(params)).$promise.then(function (results) {
                Notification.success('Annotation created correctly');
                lastAnnotationsUpdated = results;
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }

        /**
         * Update existing annotation on sparql
         * @param params
         * @returns {*}
         */
        function update(params) {
            if (!user.logInStatus()) {
                Notification.error('You are not logged in');
                return;
            }
            return Annotation.update(jQuery.param(params)).$promise.then(function (results) {
                Notification.success('Annotation updated correctly');
                lastAnnotationsUpdated = results;
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }

        /**
         * Delete existing annotation
         */
        function destroy(params) {
            if (!user.logInStatus()) {
                Notification.error('You are not logged in');
                return;
            }
            return Annotation.destroy(jQuery.param(params)).$promise.then(function (results) {
                Notification.success('Annotation removed correctly');
                lastAnnotationsUpdated = results;
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }

        /**
         * Search annotations by filter
         */
        function search(params) {
            return Annotation.search(jQuery.param(params)).$promise.then(function (results) {
                Notification.success('Documents list updated');
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }
        
        /**
         * Document auto scraping
         */
        function scraping(params) {
            if(params === '')
                return  Notification.warning('Empty search provided');
            var d = {'url':params};
            return Annotation.scraping(jQuery.param(d)).$promise.then(function (results) {
                Notification.success('Sraping completed');
                scrapingStorage = results.toJSON();
                return results;
            }, function (error) {
                // Check for errors
                Notification.error('Something goes wrong!');
                $log.error(error);
            });
        }
        
        /**
         * getter
         */
        function getScrapedContent(){
            return  scrapingStorage;
        }

        /**
         * Returns last modified annotation
         * Returns json with annotations params
         * @returns {{}}
         */
        function lastUpdated() {
            return lastAnnotationsUpdated;
        }

        /**
         * Paginator count getter
         * @returns {number}
         */
        function getModalsPaginatorCount() {
            return modalsCount;
        }

        /**
         * Pagination count setter
         * @param setter int
         */
        function setModalsPaginatorCount(setter) {
            if (typeof setter === 'undefined')
                modalsCount += 1;
            else
                modalsCount = parseInt(setter);
        }

        /**
         * Pagination count setter
         * @param setter int
         */
        function decrementModalsPaginatorCount(setter) {
            if (typeof setter === 'undefined')
                modalsCount -= 1;
            else
                modalsCount = parseInt(setter);
        }

        /**
         * When an annotaion modal is opened it requires and identifier
         * for facilitate the recognition
         */
        function setModalIdentifier() {
            jQuery('div[class="modal"]').each(function(i,el){
               jQuery(el).data('pagination-index',i);
               jQuery(el).css('z-index',0);
            });
        }

        return {
            create: create,
            update: update,
            destroy: destroy,
            search: search,
            scraping: scraping,
            lastUpdated: lastUpdated,
            getModalsPaginatorCount: getModalsPaginatorCount,
            setModalsPaginatorCount: setModalsPaginatorCount,
            decrementModalsPaginatorCount: decrementModalsPaginatorCount,
            setModalIdentifier: setModalIdentifier,
            getScrapedContent: getScrapedContent
        }
    }

})(jQuery);