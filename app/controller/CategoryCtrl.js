(function() {
    'use strict';

    angular.module('skribblez')
        .controller('CategoryCtrl', [
            '$rootScope',
            '$routeParams',
            CategoryCtrl
        ]);

    /**
     * CategoryCtrl
     */
    function CategoryCtrl($rootScope, $routeParams) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        console.log('CategoryCtrl', vm, $routeParams);
    }
})();
