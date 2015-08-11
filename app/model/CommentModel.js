(function() {
    'use strict';

    angular.module('skribblez')
        .service('CommentModel', ['BaseModel', function(BaseModel) {

            /**
             * [Constructor]
             */
            function CommentModel() {
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
                this.body = '';

                /*
                 * @var UserModel
                 */
                this.user = null;
            }

            // Extend BaseModel
            CommentModel.prototype = Object.create(BaseModel.prototype);

            // return class
            return CommentModel;
        }]);

})();