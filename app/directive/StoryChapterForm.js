(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStoryChapterForm', [skStoryChapterForm]);

    /**
     * skStoryChapterForm directive
     */
    function skStoryChapterForm() {
        return {
            templateUrl: '/view/directive/story-chapter-form.html',
            restrict: 'E',
            scope: {
                chapterId: '@'
            },
            link: function($scope) {
                $scope.$watch('chapterId', function(newChapterId, oldChapterId) {
                    $scope.scfc.chapterId = newChapterId;
                });
            },
            controller: 'StoryChapterFormCtrl',
            controllerAs: 'scfc'
        };
    }
})();