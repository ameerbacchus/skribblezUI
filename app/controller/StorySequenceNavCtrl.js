(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StorySequenceNavCtrl', [
            '$scope',
            StorySequenceNavCtrl
        ]);

    /**
     * StorySequenceNavCtrl
     * Controller for the 'skStorySequenceNav' directive
     */
    function StorySequenceNavCtrl($scope) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        var eventNamespace = $scope.namespace ? $scope.namespace : 'storySequenceNav';

        // view properties
        vm.sequence = $scope.sequenceData;

        // view functions
        vm.clickArrow = clickArrow;

        /**
         * Handles the click event on the left and right nav arrows
         * and fires an event for the higher-level controller listen to.
         */
        function clickArrow(evt, dirKey) {
            evt.preventDefault();
            var $target = $(evt.currentTarget);
            if (!$target.attr('disabled')) {
                $scope.$emit(eventNamespace + ':navigate', vm.sequence[dirKey]);
            }
        }
    }
})();
