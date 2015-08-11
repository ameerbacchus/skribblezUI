(function() {
    'use strict';

    angular.module('skribblez')
        .service('BaseModel', function() {

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
                    console.log('.get() failed: undefined key "'+ key +' cannot be retrieved"');
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
                    console.log('.set() failed: undefined key "'+ key +' cannot be set"');
                }

                return this;
            };

            // return class
            return BaseModel;
        });

})();