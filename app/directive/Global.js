(function() {
    'use strict';

    angular.module('skribblez')
        .directive('skGlobal', ['$window', 'EVENT_NS', skGlobal]);

    /**
     * skGlobal directive
     */
    function skGlobal($window, EVENT_NS) {
        var NS = EVENT_NS.GLOBAL,
            KEY_NAMES = {
                37: 'leftArrow',
                38: 'upArrow',
                39: 'rightArrow',
                40: 'downArrow'
            };

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

                // keydown event handler
                $win.bind('keydown', function(evt) {
                    var keyName = '';
                    if (typeof KEY_NAMES[evt.keyCode] !== 'undefined') {
                        keyName = KEY_NAMES[evt.keyCode];
                    } else {
                        keyName = 'UNMAPPED KEY CODE: ' + evt.keyCode;
                    }

                    $scope.$broadcast(NS + 'keydown', evt, keyName);
                });
            }
        };
    }
})();