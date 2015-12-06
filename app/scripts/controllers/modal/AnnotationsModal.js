(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('AnnotationsModal', annotationsModal)

    function annotationsModal($scope, $modalInstance, $log, fragmentText,
                              user, annotationManager, Notification, documents) {

        var ct = jQuery(fragmentText.currentTarget);
        var dataset = fragmentText.currentTarget.dataset;
        
        var collection = jQuery('*[data-hash="'+dataset.hash+'"]');

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
            hasRethoric: 'Rethoric'
        };
        
        angular.forEach(collection, function(value, key) {
            var ct = jQuery(value);
            $scope.fragmentCollection.push({
                documentAType:{
                    type : ct.data('type'),
                    subject : ct.data('fragment'),
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
                    citation : ct.data('type') == 'references' ? ct.data('fragment') : '',
                    comment : ct.data('type') == 'hasComment' ? ct.data('fragment') : '',
                    rethoric:{
                        'abstract': 'Abstract',
                        'discussion': 'Discussion',
                        'conclusion': 'Conclusion',
                        'introductions': 'Introductions',
                        'materials': 'Materials',
                        'methods': 'Methods',
                        'results': 'Results'
                    }
                },
                dat: '',
                fat: '',
                annotationTypeLiteral: $scope.documentProperties[ct.data('type')] || 'Author',
                annotationFragmentTypeLiteral: $scope.fragmentProperties[ct.data('type')] || 'References',
                rethoricType: 'abstract',
                rethoricTypeLiteral: 'Abstract'
            });
        });
        
        /**
         *  Helper function
         */
        function prepareData() {
            var form = {};
            var userData = user.userData();
            angular.extend(form, $scope.fragmentAType);
            angular.extend(form, $scope.documentAType);
            angular.extend(form, dataset);
            angular.extend(form, {
                "docSource": documents.getCurrentDocumentSource(),
                "email": userData.email,
                "username": userData.name
            });
            
            return form;
        }

        /**
        * 
        * 
        */
        $scope.submit = function () {
            
            //TODO save triple notation
            var form = prepareData();
            
            Notification.info('Waiting please');
            
             if(form.type === 'noType'){
                form.type = $scope.currentNonLiteralType;
                if($scope.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            
            annotationManager.update(form).then(function (results) {
                $modalInstance.close();
                /* Empty the memory */
                $scope.currentNonLiteralType = '';
            });
        };
        
        /**
         * 
         * 
         */
        $scope.saveItLater = function() {
            var form = prepareData();
             if(form.type === 'noType'){
                form.type = $scope.currentNonLiteralType;
                if($scope.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            annotationManager.setCreatedAnnotations(form);
            Notification.success('Annotation saved for later');
        }

        /**
         * 
         * 
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            annotationManager.decrementModalsPaginatorCount();
        };

        /**
         * 
         * 
         */
        $scope.selectDocumentAType = function (type, index) {
            
            $scope.fragmentCollection[index].dat = type;
            $scope.fragmentCollection[index].annotationTypeLiteral = $scope.documentProperties[type];
            $scope.fragmentCollection[index].currentNonLiteralType = type;
        }
        
        /**
         * 
         * 
         */
        $scope.selectFragmentAType = function (type, index) {
            
            $scope.fragmentCollection[index].fat = type;
            $scope.fragmentCollection[index].annotationFragmentTypeLiteral = $scope.fragmentProperties[type];
            $scope.fragmentCollection[index].currentNonLiteralType = type;
        }
        
        /**
         * 
         * 
         */
        $scope.selectFragmentRethoric = function (type, index) {
            
            $scope.fragmentCollection[index].rethoricType = type;
            $scope.fragmentCollection[index].rethoricTypeLiteral = $scope.fragmentCollection[index].fragmentAType.rethoric[type];
            $scope.fragmentCollection[index].currentNonLiteralType = type;
        }
        
        /**
         * 
         * 
         */
        $scope.login = function () {
            $scope.switchLoginView = true;
        }
        
        /**
         * 
         * 
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