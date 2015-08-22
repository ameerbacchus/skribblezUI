(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StoryCtrl', [
            '$routeParams',
//            '$location',
//            '$scope',
//            'ROUTES',
//            'UtilService',
            'SkribblezApiService',
            StoryCtrl
        ]);

    /**
     * StoryCtrl
     */
    function StoryCtrl($routeParams, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        // view properties
        vm.sequences = [];
        vm.storyTitle = '';

        // services
        var Api = SkribblezApiService;

        // other vars
        var sequenceIndex = 0;

        // the kick-off!
        loadChapter($routeParams.chapterId);

        // event handlers
        var $scrollContainer = $('#story-view div.story-wrapper'),
            walkListen = true;

        /**
         * Scroll wheel handler
         */
        $scrollContainer.on('mousewheel DOMMouseScroll', function(evt) {

            // @todo -- find an 'angular' way to do this

            if (walkListen) {
                var $scrollContainer = $(this),
                    $sequence = null,
                    deltaY = 0,
                    incr = 0;

                switch (evt.type) {
                    case 'mousewheel':    // Chrome, IE
                        deltaY = -evt.originalEvent.wheelDelta;
                        break;
                    case 'DOMMouseScroll':    // Firefox
                        deltaY = evt.originalEvent.detail;
                        break;
                    default:
                        break;
                }

                if (deltaY < 0 && sequenceIndex > 0) {
                    incr = -1;
                } else if (deltaY > 0 && sequenceIndex < vm.sequences.length - 1) {
                    incr = 1;
                }

                if (incr !== 0) {
                    sequenceIndex = sequenceIndex + incr;
                    scrollToSequence(sequenceIndex);
                }
            }
        });

        /**
         * Window resize handler
         */
        $(window).off('resize').on('resize', function(evt) {
            var sequence = getCurrentSequence();
            scrollToSequence(sequenceIndex, true);
            scrollToFrame(sequence.frameIndex, true);
        });

        /**
         * Arrow key handler
         *
         * @todo -- set ng-keyup or ng-keydown on the window object and broadcast an event down from there
         */
        $(window).off('keydown').on('keydown', function(evt) {
            if (walkListen) {
                var KEYCODES = {
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40
                };

                switch (evt.keyCode) {
                    case KEYCODES.LEFT:
                        var sequence = getCurrentSequence();
                        if (sequence.hasPrevChapter()) {
                            sequence.frameIndex--;
                            scrollToFrame(sequence.frameIndex);
                        }
                        break;

                    case KEYCODES.UP:
                        if (sequenceIndex > 0) {
                            sequenceIndex--;
                            scrollToSequence(sequenceIndex);
                        }
                        break;

                    case KEYCODES.RIGHT:
                        var sequence = getCurrentSequence();
                        if (sequence.hasNextChapter()) {
                            sequence.frameIndex++;
                            scrollToFrame(sequence.frameIndex);
                        }
                        break;

                    case KEYCODES.DOWN:
                        if (sequenceIndex < vm.sequences.length - 1) {
                            sequenceIndex++;
                            scrollToSequence(sequenceIndex);
                        }
                        break;

                    default:
                        break;
                }
            }
        });

        /**
         * Scroll vertically to a specific sequence
         *
         * @param number index
         * @param boolean skipAnimation | optional
         */
        function scrollToSequence(index, skipAnimation) {
            walkListen = false;

            var $sequence = $scrollContainer.find('.sequence').eq(index);

            if ($sequence && $sequence.length) {
                var newPos = $scrollContainer.scrollTop() + $sequence.position().top;
                if (skipAnimation) {
                    $scrollContainer.scrollTop(newPos);
                    walkListen = true;

                } else {
                    $scrollContainer.animate({
                        scrollTop: newPos
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
