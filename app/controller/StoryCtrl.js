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
                $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly

                loadActiveChapter();
            }
        });

        // scroll 'down' to the next sequence
        $scope.$on(EVENT_NS.STORY + 'walkDown', function() {
            if (walkListen && typeof vm.sequences[vm.currentSequence.level + 1] !== 'undefined') {
                walkListen = false;
                vm.currentSequence = vm.sequences[vm.currentSequence.level + 1];
                setSequenceIndex();
                $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly

                loadActiveChapter();
            }
        });

        // scroll 'left' to the previous chapter
        $scope.$on(EVENT_NS.STORY + 'walkLeft', function() {
            if (walkListen) {
                var sequence = vm.currentSequence;
                if (sequence.hasPrevChapter()) {
                    walkListen = false;
                    sequence.frameIndex--;
                    $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly

                    console.log('walkLeft', vm);

                    cleanupSequences();
                    loadActiveChapter();
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
                    $scope.$apply();    // force the change; not sure why this isn't being picked up implicitly

                    console.log('walkRight', vm);

                    cleanupSequences();
                    loadActiveChapter();
                }
            }
        });

        // fired at the end of a sequence/frame transition
        $scope.$on(EVENT_NS.STORY + 'walkEnd', function() {
            walkListen = true;
        });

        /**
         * @todo
         */
        function loadActiveChapter() {
            var sequence = vm.currentSequence,
                currentChapter = sequence.getCurrentChapter();

            var promise;
            if (currentChapter.getFullyLoaded()) {
                promise = $.Deferred().resolve(currentChapter);
            } else {
                promise = Api.getChapter(currentChapter.guid).then(function(chap) {
                    chap.setFullyLoaded(true);
                    return chap;
                });
            }

            promise.then(function(chapter) {
                console.log('loaded', chapter);
                sequence.addChapter(chapter);

                var level = vm.currentSequence.level,
                    prev = null,
                    curr = [],
                    next = [];

                var prevLevel = chapter.sequence - 1;

                var prevPromise;
                prevPromise = $.Deferred().resolve();

                buildSequence(level + 1, chapter.next);

//                if (chapter.prev && typeof vm.sequences[prevLevel] === 'undefined') {
//                    // @todo -- load siblings
//                    prevPromise = Api.getChapter(chapter.prev.guid);
//                } else {
//                    prevPromise = $.Deferred().resolve();
//                }
            });
        }

        /**
         * @todo
         */
        function init() {

            var chapter = null,
                level = 1,
                prev = null,
                curr = [],
                next = [];

            var chapterId = $routeParams.chapterId;

            Api.getChapter(chapterId)
                .then(function(c) {
                    chapter = c;
                    chapter.setFullyLoaded(true);
                    curr = [chapter];
                    next = chapter.next;
                    level = chapter.sequence;
                    return chapter.prev;
                })
                .then(function(prevChapter) {
                    if (prevChapter) {
                        prev = prevChapter;
                        return Api.getChapter(prevChapter.guid).then(function(previous) {
                            return previous.next;
                        });
                    } else {
                        return $.Deferred().resolve(null);
                    }
                })
                .then(function(siblings) {
                    var i;

                    if (siblings) {
                        curr = siblings;
                        for (i = 0; i < siblings.length; i++) {
                            var sibling = siblings[i];
                            if (sibling.guid === chapter.guid) {
                                siblings[i] = chapter;
                                break;
                            }
                        }
                    }

                    // build previous sequence
                    if (prev) {
                        if (typeof vm.sequences[level - 1] === 'undefined') {
                            buildSequence(level - 1, [prev]);
                        }
                    }

                    // build current sequence
                    var currSequence = vm.currentSequence = buildSequence(level, curr);

                    // set the frameIndex on the current sequence
                    for (i = 0; i < currSequence.chapters.length; i++) {
                        var ch = currSequence.chapters[i];
                        if (ch.guid === chapterId) {
                            currSequence.frameIndex = i;
                            break;
                        }
                    }

                    // build next sequence
                    var nextSequence = buildSequence(level + 1, next);

                    // set the current sequence index
                    setSequenceIndex();
                });
        }

        /**
         * @todo
         */
        function buildSequence(level, chapters) {
            if (chapters.length > 0) {
                var sequence = null;
                if (typeof vm.sequences[level] === 'undefined') {
                    sequence = new Sequence(level);
                } else {
                    sequence = vm.sequences[level];
                }

                sequence.addChapters(chapters);
                vm.sequences[level] = sequence;
                return sequence;
            }

            return null;
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
         * @todo
         */
        function cleanupSequences() {
            var currentLevel = vm.currentSequence.level;

            for (var level in vm.sequences) {
                if (level > currentLevel) {
                    console.log('delete level ', level);
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
