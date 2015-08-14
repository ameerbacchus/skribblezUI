(function() {
    'use strict';

    angular.module('skribblez')
        .controller('StorySequenceCtrl', [
            '$scope',
            'SkribblezApiService',
            StorySequenceCtrl
        ]);

    /**
     * StorySequenceCtrl
     * Controller for the 'skStorySequence' directive
     */
    function StorySequenceCtrl($scope, SkribblezApiService) {

        // assign 'this' to a var so we always have a simple reference to it
        var vm = this;

        // pull values placed on the directive from the parent scope
        vm.sequence = $scope.sequence;

        console.log('vm.sequence', vm.sequence);
    }
})();
