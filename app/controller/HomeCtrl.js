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
//        var chapterGuid = '{76FDDDE8-334E-448D-AA79-407815009C27}';        // starter

        var ratingGuid = '{9754B194-CE25-47A6-AE10-B45D2D54DA75}';
        var commentGuid = '{045E713C-191A-4281-AAAE-5E0C921CA8C2}';

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
//        api.postStarter('late night post', 'late night post body').then(function(newStarter) {
//            console.log('newStarter', newStarter);
//        });

//        // POST a new chapter
//        api.postChapter(chapterGuid, 'late night response body').then(function(newChapter) {
//            console.log('newChapter', newChapter);
//        });

//        // PATCH a chapter
//        api.patchChapter(chapterGuid, 'Re-update chapter body', 'Entourage Movie update').then(function(chapter) {
//            console.log('home updated chapter', chapter);
//        });

//        // POST a new comment
//        api.postComment(chapterGuid, 'another API test comment').then(function(newComment) {
//            console.log('home new comment', newComment);
//        });

//        // PATCH a comment
//        api.patchComment(commentGuid, 'updating this comment').then(function(comment) {
//            console.log('home updated comment', comment);
//        });

//        // DELETE a comment
//        api.deleteComment(commentGuid).then(function() {
//            console.log('home comment deleted', arguments);
//        });

//        // POST a new rating
//        api.postRating(chapterGuid, 4).then(function(newRating) {
//            console.log('home new rating', newRating);
//        });

//        // PATCH a rating
//        api.patchRating(ratingGuid, 3).then(function(rating) {
//            console.log('home updated rating', rating);
//        });
    };

})();
