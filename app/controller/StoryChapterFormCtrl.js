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
     *
     */
    function StoryChapterFormCtrl($scope, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        var chapterId = $scope.chapterId;

        // Services
        var Api = SkribblezApiService;

        // view properties
        vm.showForm = false;
        vm.form = {
            body: ''
        };

        // view functions
        vm.toggleForm = toggleForm;
        vm.submitForm = submitForm;

        /**
         * Toggles the showForm property
         */
        function toggleForm() {
            vm.showForm = !vm.showForm;
        }

        /**
         * Submit the form
         *
         * @todo -- fire event to bubble up
         *
         * @param chapterForm
         */
        function submitForm(chapterForm) {
            var data = vm.form;

            Api.postChapter(chapterId, data.body).then(function(newChapter) {

                // reset and hide form
                vm.form.body = '';
                chapterForm.$setPristine();
                toggleForm();

                // fire event
                $scope.$emit('chapter:created', newChapter);
            });
        }

    }
})();
