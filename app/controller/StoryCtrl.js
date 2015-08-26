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
        vm.sequences = {};
        vm.currentSequence = null;
        vm.sequenceIndex = -1;
        vm.storyTitle = '';

        // services
        var Api = SkribblezApiService;

        // other vars
        var sequenceCount = 0;
        var walkListen = true;

        /*
         * Event handlers
         */
        // scroll 'up' to the previous sequence
        $scope.$on(EVENT_NS.STORY + 'walkUp', function() {
            if (walkListen && vm.currentSequence.level > 1) {
                walkListen = false;
                vm.currentSequence = vm.sequences[vm.currentSequence.level - 1];
                setSequenceIndex();

                loadActiveFrame();
            }
        });

        // scroll 'down' to the next sequence
        $scope.$on(EVENT_NS.STORY + 'walkDown', function() {
            if (walkListen && typeof vm.sequences[vm.currentSequence.level + 1] !== 'undefined') {
                walkListen = false;
                vm.currentSequence = vm.sequences[vm.currentSequence.level + 1];
                setSequenceIndex();

                loadActiveFrame();
            }
        });

        // scroll 'left' to the previous chapter
        $scope.$on(EVENT_NS.STORY + 'walkLeft', function() {
            if (walkListen) {
                var sequence = vm.currentSequence;
                if (sequence.hasPrevChapter()) {
                    walkListen = false;
                    sequence.frameIndex--;

                    cleanupSequences();
                    loadActiveFrame();
                }
            }
        });

        // scroll 'right' to the next chapter
        $scope.$on(EVENT_NS.STORY + 'walkRight', function() {
            if (walkListen) {
                var sequence = vm.currentSequence;
                if (sequence.hasNextChapter()) {
                    walkListen = false;
                    sequence.frameIndex++;

                    cleanupSequences();
                    loadActiveFrame();
                }
            }
        });

        // fired at the end of a sequence/frame transition
        $scope.$on(EVENT_NS.STORY + 'walkEnd', function() {
            walkListen = true;
        });

        /**
         * Loads the active chapter.  Very similar to init() -- consolidate these 2 to avoid duplicate code
         */
        function loadActiveFrame() {
            var sequence = vm.currentSequence;
            var currentChapter = sequence.getCurrentChapter();

            loadFrame(currentChapter.guid).then(function(data) {
                var level = data.level,
                    prevLevel = level - 1,
                    nextLevel = level + 1;

                // build previous sequence
                if (data.previous) {
                    buildSequence(prevLevel, [data.previous], false);
                }

                // build current sequence
                vm.currentSequence = buildSequence(level, data.current, true, data.chapter);

                // build next sequence
                if (data.next.length > 0) {
                    buildSequence(nextLevel, data.next, true);
                }

                // get our indexes in order
                setSequenceIndex();
                setFrameIndex(data.chapter.guid);
            });
        }

        /**
         * Calls the Api to request a chapter, it's parent (if one exists) and compiles the data
         * to build out the Sequences
         *
         * @param string chapterId
         * @return promise
         */
        function loadFrame(chapterId) {
            var chapter,
                data = {
                    level: 1,
                    previous: null,
                    current: [],
                    next: [],
                    chapter: null
                };

            return Api.getChapter(chapterId)
                .then(function(c) {
                    chapter = c;
                    chapter.setFullyLoaded(true);
                    data.chapter = chapter;
                    data.level = chapter.sequence;
                    data.next = chapter.next;
                    return chapter;
                })
                .then(function(chapter) {
                    if (chapter.prev) {
                        return Api.getChapter(chapter.prev.guid).then(function(previous) {
                            data.previous = previous;
                            return previous.next;
                        });
                    } else {
                        return $.Deferred().resolve(null);
                    }
                })
                .then(function(siblings) {
                    data.current = siblings ? injectSibling(chapter, siblings) : [chapter];
                    return data;
                });
        }

        /**
         * Load the current chapter (with the passed in guid) and build out the necessary Sequences
         */
        function init() {
            loadFrame($routeParams.chapterId).then(function(data) {
                var level = data.level,
                    prevLevel = level - 1,
                    nextLevel = level + 1;

                // build out empty sequences so we can get all the way up to level 1 without errors and animation bugs
                if (prevLevel > 1) {
                    for (var i = 1; i < prevLevel; i++) {
                        buildSequence(i, [], false);
                    }
                }

                // build previous sequence
                if (data.previous) {
                    buildSequence(prevLevel, [data.previous], false);
                }

                // build current sequence
                vm.currentSequence = buildSequence(level, data.current, true, data.chapter);

                // build next sequence
                if (data.next.length > 0) {
                    buildSequence(nextLevel, data.next, true);
                }

                // get our indexes in order
                setSequenceIndex();
                setFrameIndex(data.chapter.guid);
            });
        }

        /**
         * Replaces a single chapter in the siblings array
         * This is used to replace a shallow-loaded chapter with a fully loaded one
         *
         * @param ChapterModel chapter
         * @param array<ChapterModel> siblings
         * @return array<ChapterModel> siblings
         */
        function injectSibling(chapter, siblings) {
            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (sibling.guid === chapter.guid) {
                    siblings[i] = chapter;
                    break;
                }
            }

            return siblings;
        }

        /**
         * Build out a Sequence object.  Retrieves an existing one if it has already been built.
         *
         * @param int level
         * @param array<ChapterModel> chapters
         * @param boolean fullLoad
         * @param ChapterModel chapterReplacement
         * @return Sequence
         */
        function buildSequence(level, chapters, fullLoad, chapterReplacement) {
            var sequence = null;
            if (typeof vm.sequences[level] === 'undefined') {
                sequence = new Sequence(level);
                sequence.setChapters(chapters);
            } else {
                sequence = vm.sequences[level];
                if (!sequence.loaded) {
                    sequence.setChapters(chapters);
                }
            }

            if (fullLoad) {
                sequence.setLoaded(true);
            }

            if (typeof chapterReplacement !== 'undefined') {
                sequence.replaceChapter(chapterReplacement);
            }

            vm.sequences[level] = sequence;
            return sequence;
        }

        /**
         * Loops through all sequences to figure out the current sequence index.
         * Sequences can be added before or after other sequences, so we need to perform this
         * loop, rather than keep a running count.
         */
        function setSequenceIndex() {
            var i = 0;
            for (var level in vm.sequences) {
                var sequence = vm.sequences[level];
                if (vm.currentSequence.level === sequence.level) {
                    vm.sequenceIndex = i;
                    break;
                }
                i++;
            }
        }

        /**
         * Sets the frame index in a Sequence based on the chapterId passed
         *
         * @param string chapterId
         */
        function setFrameIndex(chapterId) {
            // set the frameIndex on the current sequence
            var currSequence = vm.currentSequence;
            for (var i = 0; i < currSequence.chapters.length; i++) {
                var ch = currSequence.chapters[i];
                if (ch.guid === chapterId) {
                    currSequence.frameIndex = i;
                    break;
                }
            }
        }

        /**
         * Deletes unnecessary Sequences.  Used for when we 'walkLeft' or 'walkRight' and
         * later Sequences need to be removed.
         */
        function cleanupSequences() {
            var currentLevel = vm.currentSequence.level;

            for (var level in vm.sequences) {
                if (level > currentLevel) {
                    delete vm.sequences[level];
                }
            }
        }

        console.log('StoryCtrl', vm);

        // the kick-off!
        init();
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
        this.loaded = false;
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
     * Returns the current chapter
     *
     * @return ChapterModel
     */
    Sequence.prototype.getCurrentChapter = function() {
        return this.chapters[this.frameIndex];
    };

    /**
     *
     * @param ChapterModel chapter
     * @return this
     */
    Sequence.prototype.replaceChapter = function(chapter) {
        this.chapterMap[chapter.guid] = chapter;

        for (var i = 0; i < this.chapters.length; i++) {
            if (this.chapters[i].guid === chapter.guid) {
                this.chapters[i] = chapter;
                break;
            }
        }

        return this;
    };

    /**
     * [Setter]
     *
     * @param boolean loaded
     * @return this
     */
    Sequence.prototype.setLoaded = function(loaded) {
        this.loaded = loaded;
        return this;
    };

    /**
     * Returns whether or not there is a chapter to the 'left' of the current one
     *
     * @return boolean
     */
    Sequence.prototype.hasNextChapter = function() {
        return this.frameIndex < this.chapters.length - 1;
    };

    /**
     * Returns whether or not there is a chapter to the 'right' of the current one
     *
     * @return boolean
     */
    Sequence.prototype.hasPrevChapter = function() {
        return this.frameIndex > 0;
    };

})();
