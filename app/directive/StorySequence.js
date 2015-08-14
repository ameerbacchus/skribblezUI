(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStorySequence', [skStorySequence]);

    /**
     * skStorySequence directive
     */
    function skStorySequence() {
        return {
            templateUrl: '/view/directive/story-sequence.html',
            restrict: 'E',
            scope: {
                sequence: '='
            },
//            link: function($scope) {
//                $scope.$watch('chapterId', function(newChapterId, oldChapterId) {
//                    $scope.scfc.chapterId = newChapterId;
//                });
//            },
            controller: 'StorySequenceCtrl',
            controllerAs: 'ssc'
        };
    }
})();