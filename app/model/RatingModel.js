(function() {
    'use strict';

    angular.module('skribblez')
        .service('RatingModel', ['BaseModel', function(BaseModel) {

            /**
             * [Constructor]
             */
            function RatingModel() {
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
                 * @var int
                 */
                this.score = 0;
            }

            // Extend BaseModel
            RatingModel.prototype = Object.create(BaseModel.prototype);

            // return class
            return RatingModel;
        }]);

})();