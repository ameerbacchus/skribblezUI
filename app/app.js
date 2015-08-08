(function() {
    'use strict';

    // Declare app level module which depends on views, and components
    var app = angular.module('skribblez', ['ngRoute', 'restangular']);

    app
        // Route urls
        .constant('URLS', {
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
        .config(['$routeProvider', 'URLS', 'TEMPLATES', function($routeProvider, URLS, TEMPLATES) {
            $routeProvider
                // Home page
                .when(URLS.home, {
                    templateUrl: TEMPLATES.home,
                    controller: 'HomeCtrl',
                    controllerAs: 'hc'
                })

                // 'Explore All' page
                .when(URLS.explore, {
                    templateUrl: TEMPLATES.explore,
                    controller: 'ExploreCtrl',
                    controllerAs: 'ec'
                })

                // 'Explore Category' page
                .when(URLS.category, {
                    templateUrl: TEMPLATES.category,
                    controller: 'CategoryCtrl',
                    controllerAs: 'cc'
                })

                // Single story page
                .when(URLS.story, {
                    templateUrl: TEMPLATES.story,
                    controller: 'StoryCtrl',
                    controllerAs: 'sc'
                })

                // Redirect to the home page if it's an unrecognized url
                .otherwise({
                    redirectTo: URLS.home
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