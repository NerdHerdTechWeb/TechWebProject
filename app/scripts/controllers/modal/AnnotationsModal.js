(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('AnnotationsModal', annotationsModal)

    /**
     * Manage modal annotation controller
     * @param $scope
     * @param $rootScope
     * @param $modalInstance
     * @param $log
     * @param fragmentText
     * @param user
     * @param annotationManager
     * @param Notification
     * @param documents
     */
    function annotationsModal($scope, $rootScope, $modalInstance, $log, fragmentText,
                              user, annotationManager, Notification, documents) {

        var ct = jQuery(fragmentText.currentTarget);
        var dataset = fragmentText.currentTarget.dataset;
        
        var collection = jQuery('*[data-hash="'+dataset.hash+'"]');
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
        
        angular.forEach(collection, function(value, key) {
            var ct = jQuery(value);
            var split = String(ct.data('fragment')).split(',')
            $scope.fragmentCollection.push({
                documentAType:{
                    type : ct.data('type'),
                    subject : ct.data('fragment-in-document'),
                    snapID : ct.attr('id'),
                    author : ct.data('type') == 'hasAuthor' ? ct.data('fragment') : '',
                    doi : ct.data('type') == 'hasDOI' ? ct.data('fragment') : '',
                    publicationYear : ct.data('type') == 'hasPublicationYear' ? ct.data('fragment') : '',
                    title : ct.data('type') == 'hasTitle' ? ct.data('fragment') : '',
                    url : ct.data('type') == 'URL' ? ct.data('fragment') : ''
                },
                fragmentAType :{
                    type : ct.data('type'),
                    snapID : ct.attr('id'),
                    subject: ct.data('fragment'),
                    //citation : ct.data('type') == 'references' ? ct.data('fragment') : '',
                    citation : '',
                    comment : ct.data('type') == 'hasComment' ? ct.data('fragment') : '',
                    rethoric: ct.data('rhetoric-label') || 'abstract',
                    citationParams: {
                        documentTitle: '',
                        doi: '',
                        publicationDate: '',
                        authors: '',
                        url: ''
                    }
                },
                dat: ct.data('type'),
                fat: ct.data('type'),
                fatr: '',
                annotationTypeLiteral: $scope.documentProperties[ct.data('type')] || 'Author',
                annotationFragmentTypeLiteral: $scope.fragmentProperties[ct.data('type')] || 'Reference',
                rethoricType: String(ct.data('rhetoric-label')).toLowerCase() || 'abstract',
                rethoricTypeLiteral: ct.data('rhetoric-label') || 'Abstract',
                showReferencesFields: ct.data('type') == 'references' ? true : false,
                author: ct.data('author') ? ct.data('author') : user.userData().name,
                author_fullname: ct.data('author-fullname') ? ct.data('author-fullname') : user.userData().name,
                author_email: ct.data('author-email') ? ct.data('author-email') : user.userData().email,
                date: ct.data('date'),
                snapID : ct.attr('id'),
                selectedType : $scope.documentProperties[ct.data('type')] || $scope.fragmentProperties[ct.data('type')]
            });
        });

        /**
         * Helper function
         * @param index
         * @returns {{}}
         */
        function prepareData(index) {
            var form = {};
            var userData = user.userData();
            angular.extend(form, $scope.fragmentCollection[index].fragmentAType);
            angular.extend(form, $scope.fragmentCollection[index].documentAType);
            angular.merge(form, $scope.fragmentCollection[index].fragmentAType);
            angular.merge(form, $scope.fragmentCollection[index].documentAType);

            if($scope.fragmentCollection[index].dat === 'denotesRhetoric'){
                dataset.fragment = $scope.fragmentCollection[index].fragmentAType.subject;
                dataset.rhetoricLabel = $scope.fragmentCollection[index].fragmentAType.rethoric;
            }

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
         * @param index
         * @returns {*}
         */
        $scope.submit = function (index) {
            
            //TODO save triple notation
            var form = prepareData(index);
            
            Notification.info('Waiting please');
            
             if(form.type === 'noType'){
                form.type = $scope.fragmentCollection[index].currentNonLiteralType;
                if($scope.fragmentCollection[index].currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            
            annotationManager.update(form).then(function (results) {
                $rootScope.$broadcast('highlightedSaved', $scope.fragmentCollection[index]);
                $modalInstance.close();
                /* Empty the memory */
                $scope.fragmentCollection[index].currentNonLiteralType = '';
            });
        };

        /**
         * Store highlighted annotation
         * @param index
         * @returns {*}
         */
        $scope.saveItLater = function(index) {
            var form = prepareData(index);
             if(form.type === 'noType'){
                form.type = $scope.fragmentCollection[index].currentNonLiteralType;
                if($scope.fragmentCollection[index].currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            annotationManager.setCreatedAnnotations(form);
            Notification.success('Annotation saved for later');
        }

        /**
         *
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            annotationManager.decrementModalsPaginatorCount();
        };

        /**
         *
         * @param type
         * @param index
         */
        $scope.selectDocumentAType = function (type, index) {
            
            lastSelectedType = type;
            $scope.fragmentCollection[index].dat = type;
            $scope.fragmentCollection[index].documentAType.type = type;
            $scope.fragmentCollection[index].annotationTypeLiteral = $scope.documentProperties[type];
            $scope.fragmentCollection[index].selectedType = $scope.documentProperties[type];
            $scope.fragmentCollection[index].currentNonLiteralType = type;
        }

        /**
         *
         * @param type
         * @param index
         */
        $scope.selectFragmentAType = function (type, index) {
            
            lastSelectedType = type;
            $scope.fragmentCollection[index].fat = type;
            $scope.fragmentCollection[index].fragmentAType.type = type;
            $scope.fragmentCollection[index].annotationFragmentTypeLiteral = $scope.fragmentProperties[type];
            $scope.fragmentCollection[index].selectedType = $scope.fragmentProperties[type];
            $scope.fragmentCollection[index].currentNonLiteralType = type;
            
            if(type === 'references')
                $scope.fragmentCollection[index].showReferencesFields = true;
            else
                $scope.fragmentCollection[index].showReferencesFields = false;
        }

        /**
         *
         * @param type
         * @param index
         */
        $scope.selectFragmentRethoric = function (type, index, help) {
            
            lastSelectedType = help || type;
            $scope.fragmentCollection[index].rethoricType = type;
            $scope.fragmentCollection[index].rethoricTypeLiteral = $scope.rethoricProperties[type];
            $scope.fragmentCollection[index].selectedType = $scope.rethoricProperties[type];
            $scope.fragmentCollection[index].fragmentAType.rethoric = type;
            $scope.fragmentCollection[index].currentNonLiteralType = type;
        }

        /**
         *
         */
        $scope.login = function () {
            $scope.switchLoginView = true;
        }

        /**
         *
         * @param form
         */
        $scope.doLogin = function (form) {
            var isValidForm = form.$valid;
            if (isValidForm) {
                user.login($scope.user);
                $scope.$emit('logInEvent');
                $scope.logInStatus = user.logInStatus();
                $scope.switchLoginView = false;
                //$modalInstance.close();
            }
        }

        $scope.$on('logInEvent', function (event, args) {
            $scope.logInStatus = user.logInStatus();
        });

        /**
         * @deprecated
         */
        annotationManager.setModalIdentifier();
    }

})();