(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StoryCtrl', [
            '$rootScope',
            '$routeParams',
            StoryCtrl
        ]);

    /**
     * StoryCtrl
     */
    function StoryCtrl($rootScope, $routeParams) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        console.log('StoryCtrl', vm, $routeParams);
    }
})();
