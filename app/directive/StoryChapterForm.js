(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStoryChapterForm', [skStoryChapterForm]);

    /**
     * skStoryChapterForm directive
     */
    function skStoryChapterForm() {

        // @todo -- should this be a modal?

        return {
            templateUrl: '/view/directive/story-chapter-form.html',
            restrict: 'E',
            scope: {
                chapterId: '='
            },
            controller: 'StoryChapterFormCtrl',
            controllerAs: 'scfc'
        };
    }
})();