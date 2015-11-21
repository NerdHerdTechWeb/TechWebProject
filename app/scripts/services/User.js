/**
 * User login service
 * Set login session
 * Expose credentials
 * Set user logout
 * Save credentials via cookies
 */

(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('user', user);

    function user($cookies, Notification) {
        
        var loginStatus = $cookies.get('logsession') == '1' ? true : false;
        var credentials = {};

        function login(userForm) {
            loginStatus = true;
            $cookies.put('logsession','1');
            $cookies.put('userEmail',userForm.email);
            $cookies.put('userName',userForm.name);
            angular.extend(credentials,userForm);
            Notification.success('You are now logged in');
        }
        
        function logout() {
            loginStatus = false;
            $cookies.remove('logsession');
            $cookies.remove('userEmail');
            $cookies.remove('userName');
            Notification.success('You are now logged out');
        }
        
        function logInStatus (){
            var logSession = $cookies.get('logsession');
            if(logSession === '1')
                loginStatus = true;
            return loginStatus
        }
        
        function userData (){
            var credentialObj = {
                "email":$cookies.get('userEmail'),
                "name":$cookies.get('userName')
            };
            return credentialObj;
        }

        return {
            login: login,
            logout: logout,
            logInStatus: logInStatus,
            userData: userData
        }
    }

})();