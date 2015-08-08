(function() {
    'use strict';

    angular.module('skribblez')
        .controller('HomeCtrl', [
            '$rootScope',
            '$routeParams',
            HomeCtrl
        ]);

    /**
     * HomeCtrl
     */
    function HomeCtrl($rootScope, $routeParams) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        console.log('HomeCtrl', vm);
    }
})();
