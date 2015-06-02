/**
 * Global stuff
 */
(function() {
    /**
     * Sets the namespace object on the window
     *
     * @param string ns
     * @return object
     */
    window.namespace = function(ns) {
        var parts = ns.split('.');
        var obj = window;
        for (var i = 0; i < parts.length; i++) {
            var name = parts[i];
            obj[name] = obj[name] || {};
            obj = obj[name];
        }

        return obj;
    };

    // Declare the Skribblez namespace
    namespace('Skribblez');
})();

/**
 * RequireJS loading
 */
(function() {
    requirejs.config({
        baseUrl : '/js',
        paths : {
            jquery : '_lib/jquery-2.1.4.min',
            underscore : '_lib/underscore-min',
            backbone : '_lib/backbone-min'
        },
        shim : {
            backbone : {
                deps : [
                    'jquery', 'underscore'
                ],
                exports : 'Backbone'
            },
            underscore : {
                exports : '_'
            },
            jquery : {
                exports : '$'
            }
        }
    });

    require([
        'backbone', 'app'
    ], function(Backbone, app) {
        // console.log('Backbone', Backbone);
        // console.log('app', app);
         app.start();

        // console.log('_', _);
        // console.log('$', $);
        // console.log('Backbone', Backbone);
    });
})();