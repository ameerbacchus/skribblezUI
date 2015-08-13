(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skStorySequenceNav', [skStorySequenceNav]);

    /**
     * skStorySequenceNav directive
     */
    function skStorySequenceNav() {
        return {
            templateUrl: '/view/directive/story-sequence-nav.html',
            restrict: 'E',
            scope: {
                sequenceData: '=',
                namespace: '@'
            },
            link: function($scope) {
                $scope.$watch('sequenceData', function(newSequenceData, oldSequenceData) {
                    $scope.ssnc.sequence = newSequenceData;
                });
            },
            controller: 'StorySequenceNavCtrl',
            controllerAs: 'ssnc'
        };
    }
})();