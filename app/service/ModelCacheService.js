(function() {
    'use strict';

    angular.module('skribblez')
        .factory('ModelCacheService', [
            ModelCacheService
        ]);

    /**
     * Service to build models from API responses
     *
     * @return object
     */
    function ModelCacheService() {
        // return object
        var service = {};
        service.store = storeObject;
        service.retrieve = retrieveObject;

        // cache storage
        var caches = {};

        // @todo -- debugging
        window.SkribblezModelCache = caches;

        /**
         * Store an object in the specified cache
         *
         * @param string type
         * @param string id
         * @param boolean force | optional
         * @param object obj
         */
        function storeObject(type, id, obj, force) {
            if (typeof caches[type] === 'undefined') {
                caches[type] = new Cache(type);
            }

            var cache = caches[type];
            cache.add(id, obj, force);
        }

        /**
         * Retrieve an object from the specific cache
         *
         * @param string type
         * @param string id
         * @return object
         */
        function retrieveObject(type, id) {
            if (typeof caches[type] !== 'undefined') {
                var cache = caches[type];
                return cache.get(id);
            }

            return null;
        }

        return service;
    }

    /**
     * Cache class
     */
    function Cache() {
        this.itemMap = {};
        this.itemArr = [];
    }

    /**
     * Add an item to the cache
     *
     * @param string id
     * @param object obj
     * @param boolean force | optional
     * @return this
     */
    Cache.prototype.add = function(id, obj, force) {
        var exists = this.get(id);
        if (force || !exists || exists.get('updated') < obj.get('updated')) {
            this.itemArr.push(obj)
            this.itemMap[id] = obj;
        }
    };

    /**
     * Get an item from the cache
     *
     * @param string id
     * @return object
     */
    Cache.prototype.get = function(id) {
        if (typeof this.itemMap[id] !== 'undefined') {
            return this.itemMap[id];
        }

        return null;
    };

})();