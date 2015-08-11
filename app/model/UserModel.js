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
            }

            // Extend BaseModel
            UserModel.prototype = Object.create(BaseModel.prototype);

            // return class
            return UserModel;
        }]);

})();