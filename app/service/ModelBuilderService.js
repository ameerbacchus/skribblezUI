(function() {
    'use strict';

    angular.module('skribblez')
        .factory('ModelBuilderService', [
            'UserModel',
            'ChapterModel',
            ModelBuilderService
        ]);

    /**
     * Service to build models from API responses
     *
     * @return object
     */
    function ModelBuilderService(UserModel, ChapterModel) {

        /*
         * Object for storing each model class, as well as custom mappings for response values that should
         * be converted to specific objects themselves, OR for mapping response attributes to model attributes
         * with a different key.
         * Ex: the 'author' response attribute for chapters should be turned into a UserModel object
         */
        var modelConfig = {
            User: {
                modelClass: UserModel,
                modelMapping: {}
            },
            Chapter: {
                modelClass: ChapterModel,
                modelMapping: {
                    author: {
                        modelKey: 'author',
                        classKey: 'User'
                    },
                    parent: {
                        modelKey: 'parent',
                        classKey: 'Chapter'
                    },
                    prev: {
                        modelKey: 'prev',
                        classKey: 'Chapter'
                    }
                }
            }
        };

        // return object
        var service = {
            build: build
        };

        /**
         * @todo
         *
         * @param string classKey
         * @param object data
         */
        function build(classKey, data) {
            if (typeof modelConfig[classKey] !== 'undefined') {
                if (angular.isArray(data)) {
                    return buildModelArray(classKey, data);
                } else {
                    return buildModel(classKey, data);
                }
            } else {
                console.log('ModelBuilderService.build: no model class found with name "'+ classKey +'"');
            }
        }

        /**
         * @todo
         *
         * @param string classKey
         * @param object data
         */
        function buildModel(classKey, data) {
            var config = modelConfig[classKey],
                model = new config.modelClass(),
                customMapping = config.modelMapping ? config.modelMapping : {};

            for (var key in data) {
                if (typeof customMapping[key] !== 'undefined') {
                    var cmap = customMapping[key],
                        ckey = cmap.modelKey ? cmap.modelKey : key,
                        cval = data[key];

                    if (data[key] !== null && typeof data[key] === 'object' && cmap.classKey) {
                        cval = buildModel(cmap.classKey, data[key]);
                    }

                    model.set(ckey, cval);

                } else {
                    model.set(key, data[key]);
                }
            }

            return model;
        }

        /**
         * @todo
         *
         * @param string classKey
         * @param array<object> data
         */
        function buildModelArray(classKey, data) {
            var models = [];
            for (var i = 0, len = data.length; i < len; i++) {
                models.push(buildModel(classKey, data[i]));
            }

            return models;
        }

        return service;
    }

})();