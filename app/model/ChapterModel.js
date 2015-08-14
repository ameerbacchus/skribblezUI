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

                /**
                 * Custom attribute used internally
                 * @var boolean
                 */
                this.fullyLoaded = false;
            }

            // Extend BaseModel
            ChapterModel.prototype = Object.create(BaseModel.prototype);

            /**
             * [Getter]
             *
             * @return boolean
             */
            ChapterModel.prototype.getFullyLoaded = function() {
                return this.fullyLoaded;
            };

            /**
             * [Setter]
             *
             * @param boolean fullyLoaded
             * @return this
             */
            ChapterModel.prototype.setFullyLoaded = function(fullyLoaded) {
                this.fullyLoaded = true;
                return this;
            };

            // return class
            return ChapterModel;
        }]);

})();