(function() {
    'use strict';

    angular.module('skribblez')
        .controller('ExploreCtrl', [
            '$rootScope',
            '$routeParams',
            ExploreCtrl
        ]);

    /**
     * ExploreCtrl
     */
    function ExploreCtrl($rootScope, $routeParams) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        console.log('ExploreCtrl', vm);
    }
})();
