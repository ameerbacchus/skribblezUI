(function() {
    'use strict';

    angular.module('skribblez')
        .controller('HomeCtrl', [
            '$rootScope',
            '$routeParams',
            'SkribblezApiService',
            HomeCtrl
        ]);

    /**
     * HomeCtrl
     */
    function HomeCtrl($rootScope, $routeParams, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        var api = SkribblezApiService;

        api.getStarters().then(function(data) {
            // @todo
        });

        //-- just testing
        api.getChapter('{5606E05E-F7F2-48D7-8172-4410F7A44820}').then(function(data) {
            console.log('home chapter', data);
        });

        api.getChapterPath('{7E11B3C4-9488-427D-98B6-1AB94B072D6B}').then(function(data) {
            console.log('home path', arguments);
        });

        api.getChapterComments('{7E11B3C4-9488-427D-98B6-1AB94B072D6B}').then(function(data) {
            console.log('home comments', arguments);
        });

        console.log('HomeCtrl', vm);
    }
})();
