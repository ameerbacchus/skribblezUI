(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStoryScroller', ['EVENT_NS', skStoryScroller]);

    /**
     * skStoryScroller directive
     */
    function skStoryScroller(EVENT_NS) {
        var NS = EVENT_NS.STORY;

        return {
            restrict: 'A',
            scope: {
                sequenceIndex: '='
            },
            link: function($scope, $elem, attr) {
                var $scrollContainer = angular.element($elem),
                    sequenceIndex = 0;

                // watch vars
                $scope.$watch('sequenceIndex', function(newSequenceIndex, oldSequenceIndex) {
                    if (newSequenceIndex !== sequenceIndex) {
                        sequenceIndex = newSequenceIndex;
                        scrollToSequence(sequenceIndex, false);
                    } else {
                        scrollToSequence(sequenceIndex, true);
                    }
                });

                // window resize handler
                $scope.$on(EVENT_NS.GLOBAL + 'windowResize', function(e, evt) {
                    scrollToSequence(sequenceIndex, true);
                });

                // window mousewheel handler
                $scope.$on(EVENT_NS.GLOBAL + 'mousewheel', function(e, evt) {
                    var $sequence = null,
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

                    if (deltaY < 0) {
                        $scope.$emit(NS + 'walkUp');

                    } else if (deltaY > 0) {
                        $scope.$emit(NS + 'walkDown');
                    }
                });

                // window keydown handler
                $scope.$on(EVENT_NS.GLOBAL + 'keydown', function(e, evt, keyName) {
                    switch (keyName) {
                        case 'upArrow':
                            $scope.$emit(NS + 'walkUp');
                            break;

                        case 'downArrow':
                            $scope.$emit(NS + 'walkDown');
                            break;

                        default:
                            break;
                    }
                });

                /**
                 * Scroll vertically to a specific sequence
                 *
                 * @param number index
                 * @param boolean skipAnimation | optional
                 */
                function scrollToSequence(index, skipAnimation) {
                    var $sequence = $scrollContainer.find('.sequence').eq(index);

                    if ($sequence && $sequence.length) {
                        var newPos = $scrollContainer.scrollTop() + $sequence.position().top;
                        if (skipAnimation) {
                            $scrollContainer.scrollTop(newPos);

                        } else {
                            $scrollContainer.animate({
                                scrollTop: newPos
                            }, {
                                duration: 400,
                                complete: function() {
                                    $scope.$emit(NS + 'walkEnd');
                                }
                            });
                        }

                    } else {
                        $scope.$emit(NS + 'walkEnd');
                    }
                }

            }
        };
    }
})();