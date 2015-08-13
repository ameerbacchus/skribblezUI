(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StoryCtrl', [
            '$routeParams',
            '$location',
            'ROUTES',
            'UtilService',
            'SkribblezApiService',
            StoryCtrl
        ]);

    /**
     * StoryCtrl
     */
    function StoryCtrl($routeParams, $location, ROUTES, UtilService, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        // view properties
        vm.chapter = null;
        vm.storyTitle = '';
        vm.chapterLoaded = false;
        vm.sequence = {
            left: null,
            right: null,
            position: 1,
            count: 1
        };

        // view functions
        vm.goToChapter = goToChapter;

        // Services
        var Utils = UtilService;
        var Api = SkribblezApiService;

        // the story id for this view
        var chapterId = $routeParams.chapterId;

        // request chapter
        Api.getChapter(chapterId).then(function(chapter) {
            var storyTitle = chapter.title;
            if (chapter.parent) {
                storyTitle = chapter.parent.title;
            }

            if (chapter.prev) {
                getSiblings(chapter);
            }

            vm.chapter = chapter;
            vm.storyTitle = storyTitle;
            vm.chapterLoaded = true;
        });

        /**
         * Finds the siblings chapters of the given chapter.
         * @todo -- Currently we're requesting the previous chapter and looking at the .next
         * array and looping through to find  this.  This should probably have it's own API call.
         *
         * @param ChapterModel chapter
         */
        function getSiblings(chapter) {
            Api.getChapter(chapter.prev.guid).then(function(prevChapter) {
                var sequenceChapters = prevChapter.next,
                    leftSibling = null,
                    rightSibling = null,
                    count = sequenceChapters.length,
                    position = 1;

                for (var i = 0; i < count; i++) {
                    var chap = sequenceChapters[i];
                    if (chapter.guid === chap.guid) {
                        position = i + 1;

                        if (i > 0) {
                            leftSibling = sequenceChapters[i - 1];
                        }

                        if (i < count - 1) {
                            rightSibling = sequenceChapters[i + 1];
                        }

                        if (leftSibling && rightSibling) {
                            break;
                        }
                    }
                }

                vm.sequence.left = leftSibling;
                vm.sequence.right = rightSibling;
                vm.sequence.position = position;
                vm.sequence.count = count;
            });
        }

        /**
         * Redirects the view to another chapter
         *
         * @param MouseEvent evt
         * @param string chapterId
         */
        function goToChapter(evt, chapterId) {
            evt.preventDefault();
            var $target = $(evt.currentTarget);

            if (!$target.attr('disabled')) {
                var url = Utils.buildUrl(ROUTES.story, {
                    chapterId: chapterId
                });

                $location.path(url);
            }
        };

        console.log('StoryCtrl', vm);
    }
})();
