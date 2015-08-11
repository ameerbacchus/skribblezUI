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

        // story starters (1st chapters)
        vm.starters = [];

        // Skribblez API service
        var api = SkribblezApiService;

        // request starters
        api.getStarters().then(function(data) {
            vm.starters = data.starters;
        });

        this.testApi(api);    //-- @todo -- just for resting; remove this eventually

        console.log('HomeCtrl', vm);
    }

    /**
     * Function to test API endpoints
     *
     * @todo -- remove eventually
     *
     * @param SkribblezApiService api
     * @return this
     */
    HomeCtrl.prototype.testApi = function(api) {
        var chapterGuid = '{E4CA4CD0-7B48-4503-BEC2-D1C01CA1EB91}';
//        var chapterGuid = '{1CB01884-2BBF-40B7-9354-121770B91865}';
//        var chapterGuid = '{7E11B3C4-9488-427D-98B6-1AB94B072D6B}';

//        // GET single chapter
//        api.getChapter(chapterGuid).then(function(data) {
//            console.log('home chapter', data);
//        });

//        // GET chapter path
//        api.getChapterPath(chapterGuid).then(function(data) {
//            console.log('home path', data);
//        });

//        // GET chapter comments
//        api.getChapterComments(chapterGuid).then(function(data) {
//            console.log('home comments', data);
//        });

        // POST a new starter (1st chapter)
//        api.postStarter('test title 1', 'test body 2').then(function(newStarter) {
//            console.log('newStarter', newStarter);
//        });
    };

})();
