(function() {
    'use strict';

    angular.module('skribblez')
        .factory('SkribblezApiService', [
            'Restangular',
            'API_URL',
            'SkribblezApiModelBuilderService',
            SkribblezApiService
        ]);

    /**
     * Service to interface with the API, using Restangular
     *
     * @return object
     */
    function SkribblezApiService(Restangular, API_URL, SkribblezApiModelBuilderService) {

        // SkribblezApiModelBuilderService
        var MB = SkribblezApiModelBuilderService;

        // the Restangular object
        var ra = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(API_URL);
        });

        // the object to be returned
        var api = {};

        // assign individual api functions to return
        api.getStarters = getStarters;
        api.getChapter = getChapter;
        api.getChapterPath = getChapterPath;
        api.getChapterComments = getChapterComments;

        api.postStarter = postStarter;
        api.postChapter = postChapter;


        /**
         * GET starter stories
         *
         * @return Promise
         */
        function getStarters() {
            return ra.one('starters').get().then(function(data) {
                var starters = MB.build('Chapter', data.plain().starters);
                return starters;
            });
        }

        /**
         * GET a single chapter
         *
         * @return Promise
         */
        function getChapter(guid) {
            return ra.one('chapter', guid).get().then(function(data) {
                var rawData = data.plain(),
                    chapter = MB.build('Chapter', rawData.chapter),
                    nextChapters = MB.build('Chapter', rawData.next),
                    comments = MB.build('Comment', rawData.comments),
                    rating = rawData.rating,
                    userRating = MB.build('Rating', rawData.userRating);

                chapter
                    .set('next', nextChapters)
                    .set('comments', comments)
                    .set('rating', rating)
                    .set('userRating', userRating);

                return chapter;
            });
        }

        /**
         * GET a chapters hierarchal path
         *
         * @return Promise
         */
        function getChapterPath(guid) {
            return ra.one('chapter', guid).one('path').get().then(function(data) {
                var chapters = MB.build('Chapter', data.plain().path);
                return chapters;
            });
        }

        /**
         * GET chapter comments
         *
         * @return promise
         */
        function getChapterComments(guid) {
            return ra.one('chapter', guid).one('comments').get().then(function(data) {
                var comments = MB.build('Comment', data.plain().comments);
                return comments;
            });
        }

        /**
         * POST a new starter (chapter)
         *
         * @return promise
         */
        function postStarter(title, body) {
            var data = {
                author: 'author5',    // @todo -- remove  this and handle authorization correctly
                title: title,
                body: body
            };

            return ra.service('starter').post(data).then(function(newData) {
                var starter = MB.build('Chapter', newData.plain().starter);
                return starter;
            });
        }

        /**
         * POST a new chapter
         *
         * @param string prevChapterId
         * @return promise
         */
        function postChapter(prevChapterId, body) {
            var data = {
                author: 'author1',        // @todo -- remove  this and handle authorization correctly
                body: body
            };

            return ra.service('chapter').one(prevChapterId).customPOST(data).then(function(newData) {
                var chapter = MB.build('Chapter', newData.plain().chapter);
                return chapter;
            });
        }


        // return the API object
        return api;
    }
})();