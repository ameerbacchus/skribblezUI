(function() {
    'use strict';

    angular.module('skribblez')
        .factory('SkribblezApiService', [
            'Restangular',
            SkribblezApiService
        ]);

    function SkribblezApiService(Restangular) {

        // @todo -- this needs be in a config
        var baseUrl = 'http://api-local.skribblez.com:8380/';

        // the Restangular object
        var ra = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(baseUrl);
        });

        // the object to be returned
        var api = {};

        // assign individual api functions to return
        api.getStarters = getStarters;
        api.getChapter = getChapter;
        api.getChapterPath = getChapterPath;
        api.getChapterComments = getChapterComments;


        /**
         * GET starter stories
         *
         * @return Promise
         */
        function getStarters() {
            return ra.one('starters').get().then(function(data) {
                return data.plain();
            });
        }

        /**
         * GET a single chapter
         *
         * @return Promise
         */
        function getChapter(guid) {
            return ra.one('chapter', guid).get().then(function(data) {
                return data.plain();
            });
        }

        /**
         * GET a chapters hierarchal path
         *
         * @todo -- this call is failing with the test guid used in HomeCtrl
         *
         * @return Promise
         */
        function getChapterPath(guid) {
            return ra.one('chapter', guid).one('path').get().then(function(data) {
                return data.plain();
            });
        }

        /**
         * GET chapter comments
         *
         * @return promise
         */
        function getChapterComments(guid) {
            return ra.one('chapter', guid).one('comments').get().then(function(data) {
                return data.plain();
            });
        }



        // return the API object
        return api;
    }
})();