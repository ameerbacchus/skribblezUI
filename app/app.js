(function() {
    'use strict';

    // Declare app level module which depends on views, and components
    var app = angular.module('skribblez', ['ngRoute', 'restangular']);

    app
        // debug constant -- @todo set to false before going live
        .constant('SKRIBBLEZ_DEBUG', true)

        // API url -- @todo -- update before going live
        .constant('API_URL', 'http://api-local.skribblez.com:8380/')

        // Route urls
        .constant('ROUTES', {
            home: '/',
            explore: '/explore',
            category: '/category/:categoryId',
            story: '/story/:storyId'
        })

        // Template paths
        .constant('TEMPLATES', {
            home: 'view/home.html',
            explore: 'view/explore.html',
            category: 'view/category.html',
            story: 'view/story.html'
        });

    app
        .config(['$routeProvider', 'ROUTES', 'TEMPLATES', function($routeProvider, ROUTES, TEMPLATES) {
            $routeProvider
                // Home page
                .when(ROUTES.home, {
                    templateUrl: TEMPLATES.home,
                    controller: 'HomeCtrl',
                    controllerAs: 'hc'
                })

                // 'Explore All' page
                .when(ROUTES.explore, {
                    templateUrl: TEMPLATES.explore,
                    controller: 'ExploreCtrl',
                    controllerAs: 'ec'
                })

                // 'Explore Category' page
                .when(ROUTES.category, {
                    templateUrl: TEMPLATES.category,
                    controller: 'CategoryCtrl',
                    controllerAs: 'cc'
                })

                // Single story page
                .when(ROUTES.story, {
                    templateUrl: TEMPLATES.story,
                    controller: 'StoryCtrl',
                    controllerAs: 'sc'
                })

                // Redirect to the home page if it's an unrecognized url
                .otherwise({
                    redirectTo: ROUTES.home
                });
        }])

        .config(['RestangularProvider', function(RestangularProvider) {
            // Set default Content-Type header to difuse DELETE issues across browsers
            RestangularProvider.setDefaultHeaders({
                'Content-Type': 'application/json'
            });
        }]);

//    config(['$routeProvider', function($routeProvider) {
//        $routeProvider
//        // start page
//        .when('/start', {
//            templateUrl: 'view/start.html',
//            controller: 'StartCtrl',
//            controllerAs: 'startCtrl'
//        })
//
//        // repo page
//        .when('/repo/:username/:repository', {
//            templateUrl: 'view/repo.html',
//            controller: 'RepoCtrl',
//            controllerAs: 'repoCtrl'
//        })
//
//        // user page
//        .when('/user/:username', {
//            templateUrl: 'view/user.html',
//            controller: 'UserCtrl',
//            controllerAs: 'userCtrl'
//        })
//
//        // default to the start page
//        .otherwise({
//            redirectTo: '/start'
//        });
//    }])
//
//    .config(['RestangularProvider', function(RestangularProvider) {
//
//        // Base URL & Suffix
//        // RestangularProvider.setBaseUrl(AppConfig.apiBaseUrl + '/api');
//        // RestangularProvider.setRequestSuffix('.json');
//        // RestangularProvider.setFullResponse(true);
//
//        // Set default Content-Type header to difuse DELETE issues across browsers
//        RestangularProvider.setDefaultHeaders({
//            'Content-Type': 'application/json'
//        });
//
//    }])
//
//    // services bootstrap
//    .run(['$rootScope', function($rootScope) {
//
//        // // the GitHub url
//        // $rootScope.githubUrl = '';
//        // $rootScope.githubRepo = null;
//    }]);
})();