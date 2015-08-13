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

        // view properties
        vm.starters = [];

        // Skribblez API service
        var Api = SkribblezApiService;

        // request starters
        Api.getStarters().then(function(starters) {
            vm.starters = starters;
        });

        this.testApi(Api);    //-- @todo -- just for resting; remove this eventually

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
//        var chapterGuid = '{E4CA4CD0-7B48-4503-BEC2-D1C01CA1EB91}';        // use for ChapterPath
//        var chapterGuid = '{1CB01884-2BBF-40B7-9354-121770B91865}';
        var chapterGuid = '{7E11B3C4-9488-427D-98B6-1AB94B072D6B}';

//        // GET single chapter
//        api.getChapter(chapterGuid).then(function(chapter) {
//            console.log('home chapter', chapter);
//        });

//        // GET chapter path
//        api.getChapterPath(chapterGuid).then(function(data) {
//            console.log('home path', data);
//        });

//        // GET chapter comments
//        api.getChapterComments(chapterGuid).then(function(comments) {
//            console.log('home comments', comments);
//        });

//        // POST a new starter (1st chapter)
//        api.postStarter('wednesday title', 'wednesday body').then(function(newStarter) {
//            console.log('newStarter', newStarter);
//        });

//        // POST a new chapter
//        api.postChapter(chapterGuid, 'chapter response body').then(function(newChapter) {
//            console.log('newChapter', newChapter);
//        });
    };

})();
