(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StoryChapterFormCtrl', [
            '$scope',
            'SkribblezApiService',
            StoryChapterFormCtrl
        ]);

    /**
     * StoryChapterFormCtrl
     * Controller for the 'skStoryChapterForm' directive
     */
    function StoryChapterFormCtrl($scope, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        var chapterId = $scope.chapterId;

        // Services
        var Api = SkribblezApiService;

        // view properties
        vm.form = {
            body: ''
        };

        // view functions
        vm.submitForm = submitForm;

        /**
         * Submit the form
         *
         * @param chapterForm
         */
        function submitForm(chapterForm) {
            var data = vm.form;

            Api.postChapter(chapterId, data.body).then(function(newChapter) {

                // reset and hide form
                vm.form.body = '';
                chapterForm.$setPristine();

                // fire event
                $scope.$emit('storyChapterForm:chapterCreated', newChapter);
            });
        }

    }
})();
