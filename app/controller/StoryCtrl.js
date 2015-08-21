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
        vm.sequences = {};
        vm.storyTitle = '';

        // services
        var Api = SkribblezApiService;
        var sequenceCount = 0;
        var sequenceIndex = 0;

        // the kick-off!
        loadChapter($routeParams.chapterId);

        // event handlers
        var $scrollContainer = $('#story-view div.story-wrapper'),
            mwListen = true;

        $scrollContainer.on('mousewheel DOMMouseScroll', function(evt) {
            // @todo -- find an 'angular' way to do this

            if (mwListen) {
                var $scrollContainer = $(this),
                    $sequence = null,
                    deltaY = 0,
                    incr = 0;

                switch (evt.type) {
                    case 'mousewheel':    // Chrome, IE
                        deltaY = evt.originalEvent.deltaY
                        break;
                    case 'DOMMouseScroll':    // Firefox
                        deltaY = evt.originalEvent.detail;
                        break;
                    default:
                        break;
                }

                if (deltaY < 0 && sequenceIndex > 0) {
                    incr = -1;
                } else if (deltaY > 0 && sequenceIndex < sequenceCount - 1) {
                    incr = 1;
                }

                if (incr !== 0) {
                    mwListen = false;
                    $sequence = $scrollContainer.find('.sequence').eq(sequenceIndex + incr);

                    if ($sequence && $sequence.length) {
                        var newPos = $scrollContainer.scrollTop() + $sequence.position().top;
                        $scrollContainer.animate({
                            scrollTop: newPos
                        }, {
                            duration: 400,
                            complete: function() {
                                mwListen = true;
                            }
                        });
                    }

                    sequenceIndex = sequenceIndex + incr;
                }
            }
        });

        $(window).on('resize', function(evt) {
            var $sequence = $scrollContainer.find('.sequence').eq(sequenceIndex);
            var newPos = $scrollContainer.scrollTop() + $sequence.position().top;
            $scrollContainer.scrollTop(newPos)
        });

        /**
         * Calls the API to request a chapter
         *
         * @param string chapterId
         */
        function loadChapter(chapterId) {
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
                    getSequence(chapter.sequence + 1).addChapters(chapter.next);
                }

                return chapter;
            });
        }

        /**
         * Returns a sequence in the vm.sequences array.
         * If it doesn't exist, create it.
         *
         * @param array chapters
         * @return Sequence
         */
        function getSequence(level) {
            if (typeof vm.sequences[level] === 'undefined') {
                vm.sequences[level] = new Sequence(level);
                sequenceCount++;
            }

            return vm.sequences[level];
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

})();
