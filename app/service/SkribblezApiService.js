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
        api.postComment = postComment;
        api.patchComment = patchComment;
        api.postRating = postRating;
        api.patchRating = patchRating;


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
         * @param string guid
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
         * @param string guid
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
         * @param string guid
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
         * @param string title
         * @param string body
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

                // @todo -- cache insert (when caching is in place)

                return starter;
            });
        }

        /**
         * POST a new chapter
         *
         * @param string prevChapterId
         * @param string body
         * @return promise
         */
        function postChapter(prevChapterId, body) {
            var data = {
                author: 'author1',        // @todo -- remove  this and handle authorization correctly
                body: body
            };

            return ra.service('chapter').one(prevChapterId).customPOST(data).then(function(newData) {
                var chapter = MB.build('Chapter', newData.plain().chapter);

                // @todo -- cache insert (when caching is in place)

                return chapter;
            });
        }

        /**
         * POST a new comment
         *
         * @param string chapterId
         * @param string body
         * @return promise
         */
        function postComment(chapterId, body) {
            var data = {
                body: body,
                user: 'author2'            // @todo -- remove  this and handle authorization correctly
            };

            return ra.service('chapter').one(chapterId).customPOST(data, 'comment').then(function(newData) {
                var comment = MB.build('Comment', newData.plain().comment);

                // @todo -- cache insert (when caching is in place)

                return comment;
            });
        }

        /**
         * PATCH a comment
         *
         * @param string commentId
         * @param string body
         * @return promise
         */
        function patchComment(commentId, body) {
            var data = {
                body: body,
                user: 'author2'
            };

            return ra.service('comment').one(commentId).patch(data).then(function(data) {
                var comment = MB.build('Comment', data.plain().comment);

                // @todo -- update in chapter object (in cache, when caching is in place)

                return comment;
            });
        }

        /**
         * POST a new rating
         *
         * @param string chapterId
         * @param number score
         * @return promise
         */
        function postRating(chapterId, score) {
            var data = {
                score: score,
                user: 'author4'            // @todo -- remove  this and handle authorization correctly
            };

            return ra.service('chapter').one(chapterId).customPOST(data, 'rating').then(function(newData) {
                var rating = MB.build('Rating', newData.plain().rating);

                // @todo -- insert into chapter object (in cache, when caching is in place)

                return rating;
            });
        }

        /**
         * PATCH a rating
         *
         * @param string ratingId
         * @param number score
         * @return promise
         */
        function patchRating(ratingId, score) {
            var data = {
                score: score,
                user: 'author4'            // @todo -- remove  this and handle authorization correctly
            };

            return ra.service('rating').one(ratingId).patch(data).then(function(data) {
                var rating = MB.build('Rating', data.plain().rating);

                // @todo -- update in chapter object (in cache, when caching is in place)

                return rating;
            });
        }


        // return the API object
        return api;
    }
})();