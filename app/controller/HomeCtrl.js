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
//        vm.starters = [];

        // Skribblez API service
        var api = SkribblezApiService;

//        vm.starters = api.getStarters();

        // request starters
        api.getStarters().then(function(data) {
            vm.starters = data.starters;
        });

        //-- just testing
//        var chapterGuid = '{E4CA4CD0-7B48-4503-BEC2-D1C01CA1EB91}';
//        api.getChapter(chapterGuid).then(function(data) {
//            console.log('home chapter', data);
//        });
//
//        api.getChapterPath(chapterGuid).then(function(data) {
//            console.log('home path', data);
//        });
//
//        api.getChapterComments(chapterGuid).then(function(data) {
//            console.log('home comments', data);
//        });
        //-- done testing

        console.log('HomeCtrl', vm);
    }
})();
