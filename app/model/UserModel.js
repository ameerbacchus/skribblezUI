(function() {
    'use strict';

    angular.module('skribblez')
        .service('UserModel', ['BaseModel', function(BaseModel) {

            /**
             * [Constructor]
             */
            function UserModel() {
                /*
                 * @var string
                 */
                this.guid = '';

                /*
                 * @var int
                 */
                this.created = 0;

                /*
                 * @var int
                 */
                this.updated = 0;

                /*
                 * @var string
                 */
                this.firstName = '';

                /*
                 * @var string
                 */
                this.lastName = '';

                /*
                 * @var string
                 */
                this.fullName = '';
            }

            // Extend BaseModel
            UserModel.prototype = Object.create(BaseModel.prototype);

            /**
             * Post-process function
             */
            UserModel.prototype.postProcess = function() {
                this.fullName = this.firstName + ' ' + this.lastName;
            };

            // return class
            return UserModel;
        }]);

})();