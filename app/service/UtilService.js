(function() {
    'use strict';

    angular.module('skribblez')
        .factory('UtilService', [
            UtilService
        ]);

    /**
     * Utility functions
     *
     * @return object
     */
    function UtilService() {
        // return object
        var utils = {};

        utils.buildUrl = buildUrl;

        /**
         * Takes a route url (ex: /route/:idParam) and a
         * params object (ex: {idParam: 'idValue'}) and returns
         * a url string.
         */
        function buildUrl(routeUrl, params) {
            var url = routeUrl;

            if (typeof params !== 'undefined') {
                for (var key in params) {
                    var val = params[key];
                    url = url.replace(':' + key, val);
                }
            }

            return url;
        }

        return utils;
    }

})();