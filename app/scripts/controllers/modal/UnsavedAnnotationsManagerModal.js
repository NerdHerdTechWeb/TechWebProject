(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UnsavedAnnotationsManagerModal', unsavedAnnotationsManagerModal);

    /**
     * Manage not saved annotations or "saved for later" annotation
     * @param $scope
     * @param $rootScope
     * @param $modalInstance
     * @param $log
     * @param annotationManager
     * @param user
     * @param Notification
     */
    function unsavedAnnotationsManagerModal($scope, $rootScope, $modalInstance, $log, annotationManager, user, Notification) {

        var lastSelectedType = '';

        $scope.user = {};
        $scope.form = {};
        $scope.fragmentCollection = []

        $scope.logInStatus = user.logInStatus();
        $scope.switchLoginView = false;

        $scope.documentProperties = {
            hasAuthor: 'Author',
            hasDOI: 'DOI',
            hasPublicationYear: 'Publication Year',
            hasTitle: 'Title',
            hasURL: 'URL'
        };

        $scope.fragmentProperties = {
            references: 'Reference',
            hasComment: 'Comment',
            denotesRhetoric: 'Rethoric'
        };

        $scope.rethoricProperties = {
            'abstract': 'Abstract',
            'discussion': 'Discussion',
            'conclusion': 'Conclusion',
            'introduction': 'Introduction',
            'materials': 'Materials',
            'methods': 'Methods',
            'results': 'Results'
        }

        $scope.fragmentCollection = {
            documentAType: {
                type: 'noType',
                subject: '',
                snapID: '',
                author: '',
                doi: '',
                publicationYear: '',
                title: '',
                url: ''
            },
            fragmentAType: {
                type: 'noType',
                snapID: '',
                citation: '',
                comment: '',
                rethoric: 'abstract',
                citationParams: {
                    documentTitle: '',
                    doi: '',
                    publicationDate: '',
                    authors: '',
                    url: ''
                }
            },
            dat: '',
            fat: '',
            fatr: '',
            annotationTypeLiteral: 'Author',
            annotationFragmentTypeLiteral: 'Reference',
            rethoricType: 'abstract',
            rethoricTypeLiteral: 'Abstract',
            showReferencesFields: false,
            author: user.userData().name,
            author_fullname: user.userData().name,
            author_email: user.userData().email,
            date: '',
            snapID: '',
            source: ''
        };

        /**
         *  Helper function
         */
        function prepareData(row, type) {

            var citationsParams = row.citationParams || {};

            $scope.fragmentCollection = {
                documentAType: {
                    type: row.type,
                    subject: row.subject || row.fragment,
                    snapID: row.snapID || '',
                    author: row.author || user.userData().email,
                    doi: row.doi || '',
                    publicationYear: row.publicationYear || '',
                    title: row.title || '',
                    url: row.URL || ''
                },
                fragmentAType: {
                    type: row.type,
                    snapID: row.snapID || '',
                    citation: row.citation || '',
                    comment: row.comment || '',
                    rethoric: row.denotesRhetoric || 'abstract',
                    citationParams: {
                        documentTitle: citationsParams.documentTitle || '',
                        doi: citationsParams.doi || '',
                        publicationDate: citationsParams.publicationDate || '',
                        authors: citationsParams.authors || '',
                        url: citationsParams.url || ''
                    }
                },
                dat: row.type,
                fat: row.type,
                fatr: '',
                annotationTypeLiteral: $scope.documentProperties[row.type] || 'Author',
                annotationFragmentTypeLiteral: $scope.fragmentProperties[row.type] || 'Reference',
                rethoricType: 'abstract',
                rethoricTypeLiteral: 'Abstract',
                showReferencesFields: row.type == 'references' ? true : false,
                author: row.author || '',
                author_fullname: user.userData().name,
                author_email: user.userData().email,
                date: row.date || Date.now(),
                snapID: row.snapID || '',
                source: row.source
            };

            var form = {};
            var userData = user.userData();
            angular.extend(form, $scope.fragmentCollection.fragmentAType);
            angular.extend(form, $scope.fragmentCollection.documentAType);
            angular.extend(form, row);
            angular.extend(form, {
                "docSource": row.source,
                "email": userData.email,
                "username": userData.name,
                "type": row.type
            });

            if (form.type === 'reference') {
                form.type = 'references';
            }

            /* Sete last selectd type */
            //if (lastSelectedType)
                //angular.merge(form, {type: lastSelectedType});

            return form;
        }

        /**
         *
         * @param row
         * @param type
         * @returns {*}
         */
        $scope.submit = function (row, type) {

            //TODO save triple notation
            var form = prepareData(row, type);

            Notification.info('Waiting please');

            if (form.type === 'noType') {
                form.type = $scope.fragmentCollection.currentNonLiteralType;
                if ($scope.fragmentCollection.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }

            annotationManager.update(form).then(function (results) {
                $rootScope.$broadcast('highlightedSaved', $scope.fragmentCollection);
                /* Empty the memory */
                $scope.fragmentCollection.currentNonLiteralType = '';
                $scope.removeRow(row, type)
            });
        };

        /**
         *
         * @param type
         * @param index
         */
        $scope.selectDocumentAType = function (type, index) {

            lastSelectedType = type;
            $scope.fragmentCollection.dat = type;
            $scope.fragmentCollection.documentAType.type = type;
            $scope.fragmentCollection.annotationTypeLiteral = $scope.documentProperties[type];
            $scope.fragmentCollection.currentNonLiteralType = type;
        }

        /**
         *
         *
         */
        $scope.selectFragmentAType = function (type, index) {

            lastSelectedType = type;
            $scope.fragmentCollection.fat = type;
            $scope.fragmentCollection.fragmentAType.type = type;
            $scope.fragmentCollection.annotationFragmentTypeLiteral = $scope.fragmentProperties[type];
            $scope.fragmentCollection.currentNonLiteralType = type;

            if (type === 'references')
                $scope.fragmentCollection.showReferencesFields = true;
            else
                $scope.fragmentCollection.showReferencesFields = false;
        }

        /**
         *
         *
         */
        $scope.selectFragmentRethoric = function (type, index, help) {

            lastSelectedType = help || type;
            $scope.fragmentCollection.rethoricType = type;
            $scope.fragmentCollection.rethoricTypeLiteral = $scope.rethoricProperties[type];
            $scope.fragmentCollection.fragmentAType.rethoric = type;
            $scope.fragmentCollection.currentNonLiteralType = type;
        }

        $scope.switchModifyView = false;

        $scope.rowCollection = annotationManager.getCreatedAnnotations();

        $rootScope.scraped = annotationManager.getScrapedContent();
        angular.merge($scope.rowCollection, $rootScope.scraped);

        /**
         * @deprecated
         * @param row
         * @param type
         */
            //angular.extend($scope.rowCollection, $scope.createdAnnotation);

        $scope.removeRow = function removeRow(row, type) {

            switch (type) {
                case 'title':
                    delete $scope.rowCollection.title;
                    break;
                case 'doi':
                    delete $scope.rowCollection.doi;
                    break;
                case 'date':
                    delete $scope.rowCollection.date;
                    break;
                case 'reference' :
                    var index = $scope.rowCollection.references.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.references.splice(index, 1);
                    }
                    break;
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
                case 'denotesRhetoric' :
                    var index = $scope.rowCollection.denotesrhetoric.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.denotesrhetoric.splice(index, 1);
                    }
                    break;
            }
        }

        $scope.save = function (row, type) {
            $scope.submit(row, type);
        }

        $scope.saveAll = function (rowCollection) {
            Notification.info('Waiting please');

            var collection = {};
            var index = 0;
            angular.forEach(rowCollection, function (val, type) {
                //TODO save triple notation
                angular.forEach(val, function (v, i) {
                    var form = prepareData(v, type);

                    if (form.type === 'noType') {
                        form.type = $scope.fragmentCollection.currentNonLiteralType;
                        if ($scope.fragmentCollection.currentNonLiteralType === '')
                            return Notification.error('Choose an annotation type, please');
                    }

                    collection['annotation_'+index] = form;
                    index++;
                });
            });

            /**
             * Save the collection
             */
            annotationManager.saveCollection(collection).then(function (results) {
                Notification.info('All the annotations has been saved successfully');
                $scope.removeAll();
            });
        }

        $scope.edit = function (row, type) {
            $scope.switchModifyView = true;

            var citationsParams = row.citationParams || {};

            if (type === 'reference')
                type = 'references';

            lastSelectedType = type;

            $scope.lastModified = {
                'index': $scope.rowCollection[String(type).toLowerCase()].indexOf(row),
                'type': type
            };

            $scope.fragmentCollection = {
                documentAType: {
                    type: row.type,
                    subject: row.subject || row.fragment,
                    snapID: row.snapID || '',
                    author: row.author || user.userData().email,
                    doi: row.doi || '',
                    publicationYear: row.publicationYear || '',
                    title: row.title || '',
                    url: row.URL || ''
                },
                fragmentAType: {
                    type: row.type,
                    snapID: row.snapID || '',
                    citation: row.citation || '',
                    comment: row.comment || '',
                    rethoric: row.denotesRhetoric || 'abstract',
                    citationParams: {
                        documentTitle: citationsParams.documentTitle || '',
                        doi: citationsParams.doi || '',
                        publicationDate: citationsParams.publicationDate || '',
                        authors: citationsParams.authors || '',
                        url: citationsParams.url || ''
                    }
                },
                dat: row.type,
                fat: row.type,
                fatr: '',
                annotationTypeLiteral: $scope.documentProperties[row.type] || 'Author',
                annotationFragmentTypeLiteral: $scope.fragmentProperties[row.type] || 'Reference',
                rethoricType: String(row.rethoric).toLowerCase() || 'abstract',
                rethoricTypeLiteral: row.rethoric || 'Abstract',
                showReferencesFields: row.type == 'references' ? true : false,
                author: row.author || '',
                author_fullname: user.userData().name,
                author_email: user.userData().email,
                date: row.date || Date.now(),
                snapID: row.snapID || '',
                source: row.source
            };

        }

        $scope.modify = function (fIndex) {
            var current = $scope.rowCollection[$scope.lastModified.type][$scope.lastModified.index];
            angular.extend($scope.rowCollection[$scope.lastModified.type][$scope.lastModified.index], $scope.fragmentCollection);
            $scope.rowCollection[$scope.lastModified.type][$scope.lastModified.index].type = lastSelectedType;
        }

        /**
         * Remove all scraped annotations
         */
        $scope.removeAll = function () {
            $scope.rowCollection = [];
            annotationManager.removeScrapedAnnotations();
            annotationManager.removeSavedAnnotations();
        }

        $scope.switchToListView = function () {
            $scope.switchModifyView = false;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();