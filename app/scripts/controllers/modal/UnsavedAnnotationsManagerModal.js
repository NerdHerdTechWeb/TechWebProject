/**
 * 
 * 
 * 
 */

(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('UnsavedAnnotationsManagerModal', unsavedAnnotationsManagerModal);

    function unsavedAnnotationsManagerModal($scope, $rootScope, $modalInstance, $log, annotationManager, user) {
        
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
            'introductions': 'Introductions',
            'materials': 'Materials',
            'methods': 'Methods',
            'results': 'Results'
        }
        
        $scope.fragmentCollection = {
            documentAType:{
                type : 'noType',
                subject : '',
                snapID : '',
                author : '',
                doi : '',
                publicationYear : '',
                title : '',
                url : ''
            },
            fragmentAType :{
                type : 'noType',
                snapID : '',
                citation : '',
                comment : '',
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
            snapID : ''
        };
        
        /**
         *  Helper function
         */
        function prepareData(index) {
            var form = {};
            var userData = user.userData();
            angular.extend(form, $scope.fragmentCollection.fragmentAType);
            angular.extend(form, $scope.fragmentCollection.documentAType);
            angular.extend(form, dataset);
            angular.extend(form, {
                "docSource": documents.getCurrentDocumentSource(),
                "email": userData.email,
                "username": userData.name
            });
            
            /* Sete last selectd type */
            if(lastSelectedType)
                angular.merge(form,{type:lastSelectedType});
            
            return form;
        }

        /**
        * 
        * 
        */
        $scope.submit = function (index) {
            
            //TODO save triple notation
            var form = prepareData(index);
            
            Notification.info('Waiting please');
            
             if(form.type === 'noType'){
                form.type = $scope.fragmentCollection.currentNonLiteralType;
                if($scope.fragmentCollection.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            
            annotationManager.update(form).then(function (results) {
                $rootScope.$broadcast('highlightedSaved', $scope.fragmentCollection);
                $modalInstance.close();
                /* Empty the memory */
                $scope.fragmentCollection.currentNonLiteralType = '';
            });
        };
        
        /**
         * 
         * Store highlighted annotation
         * 
         */
        $scope.saveItLater = function(index) {
            var form = prepareData(index);
             if(form.type === 'noType'){
                form.type = $scope.fragmentCollection.currentNonLiteralType;
                if($scope.fragmentCollection.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            annotationManager.setCreatedAnnotations(form);
            Notification.success('Annotation saved for later');
        }

        /**
         * 
         * 
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
            
            if(type === 'references')
                $scope.fragmentCollection.showReferencesFields = true;
            else
                $scope.fragmentCollection.showReferencesFields = false;
        }
        
        /**
         * 
         * 
         */
        $scope.selectFragmentRethoric = function (type, index) {
            
            lastSelectedType = type;
            $scope.fragmentCollection.rethoricType = type;
            $scope.fragmentCollection.rethoricTypeLiteral = $scope.rethoricProperties[type];
            $scope.fragmentCollection.fragmentAType.rethoric = type;
            $scope.fragmentCollection.currentNonLiteralType = type;
        }
        
        $scope.switchModifyView = false;
        
        $scope.rowCollection = annotationManager.getCreatedAnnotations();
        
        if(!$rootScope.scraped){
            $rootScope.scraped = annotationManager.getScrapedContent();
            angular.merge($scope.rowCollection, $rootScope.scraped);
        }
        
        /* 
        * @deprecated 
        */
        //angular.extend($scope.rowCollection, $scope.createdAnnotation);

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
            }
        }

        $scope.saveAll = function () {
            //TODO prepare collection
            //TODO call annotation service
        }
        
        $scope.edit = function (row, type) {
            $scope.switchModifyView = true;
            
            var citationsParams = row.citationParams || {};
            
            $scope.fragmentCollection = {
                documentAType:{
                    type : row.type,
                    subject : row.subject || row.fragment,
                    snapID : row.snapID || '',
                    author : row.author || user.userData().email,
                    doi : row.doi || '',
                    publicationYear : row.publicationYear || '',
                    title : row.title || '',
                    url : ''
                },
                fragmentAType :{
                    type : row.type,
                    snapID : row.snapID || '',
                    citation : row.citation || '',
                    comment : row.comment || '',
                    rethoric: 'abstract',
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
                snapID : row.snapID || ''
            };
            
        }

        $scope.removeAll = function () {
            $scope.rowCollection = null;
        }
        
        $scope.switchToListView = function(){
            $scope.switchModifyView = false;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }
})();