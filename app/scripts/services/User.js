(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('user', user);

    function user(Notification) {
        
        var loginStatus = false;

        // ngResource call to our static data

        function login() {
            loginStatus = true;
            Notification.success('You are now logged in');
        }
        
        function logout() {
            loginStatus = false;
            Notification.success('You are now logged out');
        }
        
        function logInStatus (){
            return loginStatus
        }

        return {
            login: login,
            logout: logout,
            logInStatus: logInStatus
        }
    }

})();