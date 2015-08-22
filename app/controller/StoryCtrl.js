(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StoryCtrl', [
            '$scope',
            '$routeParams',
            'EVENT_NS',
//            '$location',
//            'ROUTES',
//            'UtilService',
            'SkribblezApiService',
            StoryCtrl
        ]);

    /**
     * StoryCtrl
     */
    function StoryCtrl($scope, $routeParams, EVENT_NS, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        // view properties
        vm.sequences = [];
        vm.storyTitle = '';

        // services
        var Api = SkribblezApiService;

        // other vars
        var sequenceIndex = 0;
        vm.sequenceIndex = 0;
        var walkListen = true;

        // the kick-off!
        loadChapter($routeParams.chapterId);

        // event handlers
        var $scrollContainer = $('#story-view div.story-wrapper');    // parent container of 'sequence' dom elements; the 'sk-story-sequence' directive

        // scroll 'up' to the previous sequence
        $scope.$on(EVENT_NS.STORY + 'walkUp', function() {
            if (walkListen && vm.sequenceIndex > 0) {
                walkListen = false;

                sequenceIndex--;
                vm.sequenceIndex = sequenceIndex;
                $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly
            }
        });

        // scroll 'down' to the next sequence
        $scope.$on(EVENT_NS.STORY + 'walkDown', function() {
            if (walkListen && vm.sequenceIndex < vm.sequences.length - 1) {
                walkListen = false;

                sequenceIndex++;
                vm.sequenceIndex = sequenceIndex;
                $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly
            }
        });

        // fired at the end of a sequence/frame transition
        $scope.$on(EVENT_NS.STORY + 'walkEnd', function() {
            walkListen = true;
        });

        /**
         * Window resize handler
         */
//        $scope.$on(EVENT_NS.GLOBAL + 'windowResize', function(evt) {
//            var sequence = getCurrentSequence();
////            scrollToSequence(sequenceIndex, true);
//            scrollToFrame(sequence.frameIndex, true);
//        });


        /**
         * Arrow key handler
         *
         * @todo -- set ng-keyup or ng-keydown on the window object and broadcast an event down from there
         */
//        $(window).off('keydown').on('keydown', function(evt) {
//            if (walkListen) {
//                var KEYCODES = {
//                    LEFT: 37,
//                    UP: 38,
//                    RIGHT: 39,
//                    DOWN: 40
//                };
//
//                switch (evt.keyCode) {
//                    case KEYCODES.LEFT:
//                        var sequence = getCurrentSequence();
//                        if (sequence.hasPrevChapter()) {
//                            sequence.frameIndex--;
//                            scrollToFrame(sequence.frameIndex);
//                        }
//                        break;
//
//                    case KEYCODES.UP:
//                        if (sequenceIndex > 0) {
//                            vm.sequenceIndex = sequenceIndex--;
////                            scrollToSequence(sequenceIndex);
//                        }
//                        break;
//
//                    case KEYCODES.RIGHT:
//                        var sequence = getCurrentSequence();
//                        if (sequence.hasNextChapter()) {
//                            sequence.frameIndex++;
//                            scrollToFrame(sequence.frameIndex);
//                        }
//                        break;
//
//                    case KEYCODES.DOWN:
//                        if (sequenceIndex < vm.sequences.length - 1) {
//                            vm.sequenceIndex = sequenceIndex++;
////                            scrollToSequence(sequenceIndex);
//                        }
//                        break;
//
//                    default:
//                        break;
//                }
//            }
//        });

        /**
         * Scroll horizontally to a specific frame
         *
         * @param number index
         * @param boolean skipAnimation | optional
         */
        function scrollToFrame(index, skipAnimation) {
            walkListen = false;

            var $sequence = $scrollContainer.find('.sequence').eq(sequenceIndex),
                $frames = $sequence.find('div.frames'),
                $targetFrame = $frames.find('div.frame').eq(index),
                newPos = $targetFrame.outerWidth() * index;

            if ($targetFrame && $targetFrame.length) {
                if (skipAnimation) {
                    $frames.scrollLeft(newPos);
                    walkListen = true;

                } else {
                    $frames.animate({
                        scrollLeft: newPos
                    }, {
                        duration: 400,
                        complete: function() {
                            walkListen = true;
                        }
                    });
                }

            }
        }

        /**
         * Calls the API to request a chapter
         *
         * @param string chapterId
         */
        function loadChapter(chapterId) {
            console.log('loadChapter', chapterId);
            Api.getChapter(chapterId).then(function(chapter) {
                var storyTitle = chapter.title;
                if (chapter.parent) {
                    storyTitle = chapter.parent.title;
                }
                vm.storyTitle = storyTitle;

                getSequence(chapter.sequence).addChapter(chapter);

                // request the previous chapter to get this chapter's siblings
//                if (chapter.prev) {
//                    Api.getChapter(chapter.prev.guid).then(function(prevChapter) {
//                        // @todo
//                    });
//                }

                if (chapter.next.length > 0) {
                    getSequence(chapter.sequence + 1, true).addChapters(chapter.next);
                    console.log('vm.sequences 1', vm.sequences);
                } else {
                    // @todo -- remove later sequences
                    console.log('vm.sequences 2', vm.sequences);
                }

                return chapter;
            });
        }

        /**
         * Returns a sequence in the vm.sequences object.
         * If it doesn't exist, create it.
         *
         * @todo -- order sequences correctly.
         *
         * @param number level
         * @param boolean replace | optional
         * @return Sequence
         */
        function getSequence(level, replace) {
            var index = level - 1;
            if (typeof vm.sequences[index] === 'undefined') {
                console.log('new sequence', index);
                vm.sequences[index] = new Sequence(level);

            } else if (replace) {
                console.log('replace sequence', index);
                vm.sequences[index] = new Sequence(level);
            }

            return vm.sequences[index];
        }

        /**
         * Returns the current Sequence object
         *
         * @return Sequence
         */
        function getCurrentSequence() {
            return getSequence(sequenceIndex + 1);
        }

        console.log('StoryCtrl', vm);
    }

    /**
     * [Constructor]
     *
     * @param number level
     */
    function Sequence(level) {
        this.level = level;
        this.chapters = [];
        this.chapterMap = {};
        this.frameIndex = 0;
    }

    /**
     * [Setter]
     *
     * @param array<ChapterModel> chapters
     * @return this
     */
    Sequence.prototype.setChapters = function(chapters) {
        this.chapters = chapters;
        return this;
    };

    /**
     * Adds a chapter to the sequence
     *
     * @param ChapterModel chapter
     * @returns this
     */
    Sequence.prototype.addChapter = function(chapter) {
        if (typeof this.chapterMap[chapter.guid] !== 'undefined') {
            for (var i = 0, len = this.chapters.length; i < len; i++) {
                var ch = this.chapters[i];
                if (ch.guid === chapter.guid) {
                    this.chapters[i] = chapter;
                    break;
                }
            }
        } else {
            this.chapters.push(chapter);
        }

        this.chapterMap[chapter.guid] = chapter;

        return this;
    };

    /**
     * Adds multiple chapters to the sequence
     *
     * @todo -- optimize this; we don't need to call this.addChapter and run through that loop every single time
     *
     * @param array<ChapterModel> chapters
     * @return this
     */
    Sequence.prototype.addChapters = function(chapters) {
        for (var i = 0, len = chapters.length; i < len; i++) {
            this.addChapter(chapters[i]);
        }

        return this;
    };

    /**
     * @todo
     *
     * @return boolean
     */
    Sequence.prototype.hasNextChapter = function() {
        return this.frameIndex < this.chapters.length - 1;
    };

    /**
     * @todo
     *
     * @return boolean
     */
    Sequence.prototype.hasPrevChapter = function() {
        return this.frameIndex > 0;
    };

})();
