(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStorySequence', ['EVENT_NS', skStorySequence]);

    /**
     * skStorySequence directive
     */
    function skStorySequence(EVENT_NS) {
        return {
            templateUrl: '/view/directive/story-sequence.html',
            restrict: 'E',
            scope: {
                sequence: '=',
                isActive: '=',
                frameIndex: '='
            },
            link: function($scope, $elem, $attr) {
                var $frameContainer = $elem.find('div.frames'),
                    frameIndex = 0;;

                // watch vars
                $scope.$watch('frameIndex', function(newFrameIndex, oldFrameIndex) {
                    var skipAnimation = true;
                    if (newFrameIndex !== frameIndex) {
                        skipAnimation = false;
                        frameIndex = newFrameIndex;
                    }
                    scrollToFrame(frameIndex, skipAnimation);
                });

                // window resize handler
                $scope.$on(EVENT_NS.GLOBAL + 'windowResize', function(e, evt) {
                    scrollToFrame(frameIndex, true);
                });

                // window keydown handler
                $scope.$on(EVENT_NS.GLOBAL + 'keydown', function(e, evt, keyName) {
                    if ($scope.isActive) {
                        switch (keyName) {
                            case 'leftArrow':
                                $scope.$emit(EVENT_NS.STORY + 'walkLeft');
                                break;

                            case 'rightArrow':
                                $scope.$emit(EVENT_NS.STORY + 'walkRight');
                                break;

                            default:
                                break;
                        }
                    }
                });

                /**
                 * Scroll horizontally to a specific frame
                 *
                 * @param number index
                 * @param boolean skipAnimation | optional
                 */
                function scrollToFrame(index, skipAnimation) {
                    var $targetFrame = $frameContainer.find('div.frame').eq(index),
                        newPos = $targetFrame.outerWidth() * index;

                    if ($targetFrame && $targetFrame.length) {
                        if (skipAnimation) {
                            $frameContainer.scrollLeft(newPos);
                            $scope.$emit(EVENT_NS.STORY + 'walkEnd');

                        } else {
                            $frameContainer.animate({
                                scrollLeft: newPos
                            }, {
                                duration: 400,
                                complete: function() {
                                    $scope.$emit(EVENT_NS.STORY + 'walkEnd');
                                }
                            });
                        }

                    } else {
                        $scope.$emit(EVENT_NS.STORY + 'walkEnd');
                    }
                }
            },
            controller: 'StorySequenceCtrl',
            controllerAs: 'ssc'
        };
    }
})();