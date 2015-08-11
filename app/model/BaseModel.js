(function() {
    'use strict';

    angular.module('skribblez')
        .service('BaseModel', ['SKRIBBLEZ_DEBUG', function(SKRIBBLEZ_DEBUG) {

            /**
             * [Constructor]
             */
            function BaseModel() {

            }

            /**
             * [Getter]
             *
             * @param string key
             * @return mixed
             */
            BaseModel.prototype.get = function(key) {
                if (typeof this[key] !== 'undefined') {
                    return this[key];
                } else {
                    if (SKRIBBLEZ_DEBUG) {
                        console.info('.get() failed: undefined key "'+ key +' cannot be retrieved"');
                    }
                }
            };

            /**
             * [Setter]
             *
             * @param string key
             * @param mixed value
             * @return this
             */
            BaseModel.prototype.set = function(key, value) {
                if (typeof this[key] !== 'undefined') {
                    this[key] = value;
                } else {
                    if (SKRIBBLEZ_DEBUG) {
                        console.info('.set() failed: undefined key "'+ key +'" cannot be set', this);
                    }
                }

                return this;
            };

            /**
             * Function to call after building a model
             *
             * @abstract
             */
            BaseModel.prototype.postProcess = function() {};

            // return class
            return BaseModel;
        }]);

})();