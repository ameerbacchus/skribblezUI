(function() {
    'use strict';

    angular.module('skribblez')
        .service('ChapterModel', ['BaseModel', function(BaseModel) {

            /**
             * [Constructor]
             */
            function ChapterModel() {
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
                 * @var UserModel
                 */
                this.author = null;

                /*
                 * @var string
                 */
                this.body = '';

                /*
                 * @var ChapterModel
                 */
                this.parent = null;

                /*
                 * @var ChapterModel
                 */
                this.prev = null;

                /*
                 * @var int
                 */
                this.sequence = 0;

                /*
                 * @var string
                 */
                this.title = '';

                /*
                 * @var array<CommentModel>
                 */
                this.comments = [];

                /*
                 * @var array<ChapterModel>
                 */
                this.next = [];

                /*
                 * @var object
                 */
                this.rating = null;

                /*
                 * @var RatingModel
                 */
                this.userRating = null;
            }

            // Extend BaseModel
            ChapterModel.prototype = Object.create(BaseModel.prototype);

            // return class
            return ChapterModel;
        }]);

})();