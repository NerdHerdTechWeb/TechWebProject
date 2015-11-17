(function () {

    'use strict';

    angular
        .module('semanticNotations')
        .controller('AnnotationsModal', annotationsModal)

    function annotationsModal($scope, $modalInstance, $log, fragmentText,
                              user, annotationManager, Notification, documents) {

        var ct = jQuery(fragmentText.currentTarget);
        var dataset = fragmentText.currentTarget.dataset;

        $scope.user = {};
        $scope.form = {};

        $scope.logInStatus = user.logInStatus();
        $scope.switchLoginView = false;
        
        /* Last selected document annotation or fragment type */
        $scope.currentNonLiteralType = '';

        $scope.documentProperties = {
            hasAuthor: 'Author',
            hasDOI: 'DOI',
            hasPublicationYear: 'Publication Year',
            references: 'Reference',
            hasTitle: 'Title',
            hasURL: 'URL'
        };

        $scope.fragmentProperties = {
            hasCitation: 'Citation',
            hasComment: 'Comment',
            hasRethoric: 'Rethoric'
        };

        $scope.documentAType = {};
        $scope.documentAType.type = ct.data('type');
        $scope.documentAType.subject = ct.data('fragment');
        $scope.documentAType.author = $scope.documentAType.type == 'hasAuthor' ? ct.data('fragment') : '';
        $scope.documentAType.doi = $scope.documentAType.type == 'hasDOI' ? ct.data('fragment') : '';
        $scope.documentAType.publicationYear = $scope.documentAType.type == 'hasPublicationYear' ? ct.data('fragment') : '';
        $scope.documentAType.references = $scope.documentAType.type == 'references' ? ct.data('fragment') : '';
        $scope.documentAType.title = $scope.documentAType.type == 'hasTitle' ? ct.data('fragment') : '';
        $scope.documentAType.url = $scope.documentAType.type == 'URL' ? ct.data('fragment') : '';

        $scope.fragmentAType = {};
        $scope.fragmentAType.rethoric = {
            'abstract': 'Abstract',
            'discussion': 'Discussion',
            'conclusion': 'Conclusion',
            'introductions': 'Introductions',
            'materials': 'Materials',
            'methods': 'Methods',
            'results': 'Results'
        };
        $scope.fragmentAType.type = ct.data('type');
        $scope.fragmentAType.citation = $scope.fragmentAType.type == 'hasCitation' ? ct.data('fragment') : '';
        $scope.fragmentAType.comment = $scope.fragmentAType.type == 'hasComment' ? ct.data('fragment') : '';

        $scope.annotationTypeLiteral = $scope.documentProperties[$scope.documentAType.type] || 'Author'
        $scope.annotationFragmentTypeLiteral = $scope.fragmentProperties[$scope.fragmentAType.type] || 'Citation';
        //TODO check rethoric type
        $scope.rethoricTypeLiteral = 'Abstract';

        $scope.dat = $scope.documentAType.type;
        $scope.fat = $scope.fragmentAType.type;
        // TODO check rethoric type
        $scope.rethoricType = 'abstract';

        $scope.submit = function () {
            //TODO save triple notation
            var form = {};
            var userData = user.userData();
            angular.extend(form, $scope.fragmentAType);
            angular.extend(form, $scope.documentAType);
            angular.extend(form, dataset);
            angular.extend(form, {
                "docSource": documents.getCurrentDocumentSource(),
                "email": userData.email,
                "username": userData.username
            });
            
            if(form.type === 'noType'){
                form.type = $scope.currentNonLiteralType;
                if($scope.currentNonLiteralType === '')
                    return Notification.error('Choose an annotation type, please');
            }
            
            Notification.info('Waiting please');
            
            annotationManager.update(form).then(function (results) {
                $log.info(results);
                $modalInstance.close();
                /* Empty the memory */
                $scope.currentNonLiteralType = '';
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            annotationManager.decrementModalsPaginatorCount();
        };

        $scope.selectDocumentAType = function (type) {
            $scope.dat = type;
            $scope.annotationTypeLiteral = $scope.documentProperties[type];
            $scope.currentNonLiteralType = type;
        }

        $scope.selectFragmentAType = function (type) {
            $scope.fat = type;
            $scope.annotationFragmentTypeLiteral = $scope.fragmentProperties[type];
            $scope.currentNonLiteralType = type;
        }

        $scope.selectFragmentRethoric = function (type) {
            $scope.rethoricType = type;
            $scope.rethoricTypeLiteral = $scope.fragmentAType.rethoric[type];
            $scope.currentNonLiteralType = type;
        }

        $scope.login = function () {
            $scope.switchLoginView = true;
        }

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

        annotationManager.setModalIdentifier();
    }

})();