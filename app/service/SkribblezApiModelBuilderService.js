(function() {
    'use strict';

    angular.module('skribblez')
        .factory('SkribblezApiModelBuilderService', [
            'ModelCacheService',
            'UserModel',
            'ChapterModel',
            'CommentModel',
            'RatingModel',
            SkribblezApiModelBuilderService
        ]);

    /**
     * Service to build models from API responses
     *
     * @return object
     */
    function SkribblezApiModelBuilderService(ModelCacheService, UserModel, ChapterModel, CommentModel, RatingModel) {

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
            },
            Comment: {
                modelClass: CommentModel,
                modelMapping: {
                    user: {
                        modelKey: 'user',
                        classKey: 'User'
                    }
                }
            },
            Rating: {
                modelClass: RatingModel,
                modelMapping: {

                }
            }
        };

        // return object
        var service = {
            build: build
        };

        /**
         * Takes in response data from the API and builds model objects from them
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
                console.log('SkribblezApiModelBuilderService.build: no modelConfig object found with name "'+ classKey +'"');
            }
        }

        /**
         * Clean up a data object before parsing through it set model values
         *
         * @param object data
         * @return object
         */
        function cleanDataObj(data) {
            /*
             * An array of keys we don't want to pay attention to
             * Doctrine sends excess stuff back sometimes; delete it here to avoid
             * unnecessary warnings.
             */
            var excludedKeys = ['__isInitialized__'];
            for (var i = 0, len = excludedKeys.length; i < len; i++) {
                var eKey = excludedKeys[i];
                if (typeof data[eKey] !== 'undefined') {
                    delete data[eKey];
                }
            }

            return data;
        }

        /**
         * Builds a single model object from response data
         *
         * @param string classKey
         * @param object data
         */
        function buildModel(classKey, data) {
            if (data === null) {
                return null;
            }

            var config = modelConfig[classKey],
                model = new config.modelClass(),
                customMapping = config.modelMapping ? config.modelMapping : {};

            data = cleanDataObj(data);

            /*
             * Loop through the data object and set values on the model
             */
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

            model.postProcess();

            return model;

            // @todo -- move caching to the API service

//            var id = model.get('guid');
//            ModelCacheService.store(classKey, id, model);
//
//            return ModelCacheService.retrieve(classKey, id);;
        }

        /**
         * Builds an array of models from response data
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