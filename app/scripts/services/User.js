(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('user', user);

    function user($cookies, Notification) {
        
        var loginStatus = $cookies.get('logsession') == '1' ? true : false;
        var credentials = {};

        // ngResource call to our static data

        function login(userForm) {
            loginStatus = true;
            $cookies.put('logsession','1');
            credentials.email = userForm.email;
            credentials.password = userForm.password;
            Notification.success('You are now logged in');
        }
        
        function logout() {
            loginStatus = false;
            $cookies.remove('logsession');
            Notification.success('You are now logged out');
        }
        
        function logInStatus (){
            var logSession = $cookies.get('logsession');
            if(logSession === '1')
                loginStatus = true;
            return loginStatus
        }
        
        function userData (){
            return credentials;
        }

        return {
            login: login,
            logout: logout,
            logInStatus: logInStatus,
            userData: userData
        }
    }

})();