(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skGlobal', ['$window', 'EVENT_NS', skGlobal]);

    /**
     * skGlobal directive
     */
    function skGlobal($window, EVENT_NS) {
        var NS = EVENT_NS.GLOBAL;

        return {
            restrict: 'A',
            link: function($scope, $elem, attr) {

                var $win = angular.element($window);

                // the window resize event handler
                $win.bind('resize', function(evt) {
                    $scope.$broadcast(NS + 'windowResize', evt);
                });

                // mousewheel event handler
                $win.bind('mousewheel DOMMouseScroll', function(evt) {
                    $scope.$broadcast(NS + 'mousewheel', evt);
                });
            }
        };
    }
})();