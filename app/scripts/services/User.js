(function() {

    'use strict';

    angular
        .module('semanticNotations')
        .factory('user', user);

    function user($cookies, Notification) {
        
        var loginStatus = $cookies.get('logsession') == '1' ? true : false;

        // ngResource call to our static data

        function login() {
            loginStatus = true;
            $cookies.put('logsession','1');
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
            
        }

        return {
            login: login,
            logout: logout,
            logInStatus: logInStatus
        }
    }

})();