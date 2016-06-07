angular.module('FormalWear', ['ionic', 'FormalWear.controllers', 'FormalWear.services'])

    .run(function($ionicPlatform, $state, $http) {
        $ionicPlatform.ready(function() {
            if (window.cordova === undefined) {
                facebookConnectPlugin.browserInit('497876500390714');
            }

            window.localStorage['serverIP'] = 'http://52.34.196.148:8080/';

            $http.post(window.localStorage.serverIP + 'auth/check', {
                token: window.localStorage.token
            }).then(
                function success(response) {
                    $state.go('tab.feed');
                },
                function error(response) {
                    console.log('Login failed. Going to splash...');
                }
            )

            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('splash', {
                cache: false,
                url: '/splash',
                controller: 'SplashCtrl',
                templateUrl: 'templates/splash.html'
            })

            .state('email', {
                cache: false,
                url: '/email',
                controller: 'EmailCtrl',
                templateUrl: 'templates/email.html'
            })

            .state('tab', {
                url: '/tab',
                controller: 'TabCtrl',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('tab.feed', {
                url: '/feed',
                views: {
                    'tab-feed': {
                        templateUrl: 'templates/tab-feed.html',
                        controller: 'FeedCtrl'
                    }
                }
            })
            .state('tab.feed-question', {
                cache: false,
                url: '/feed/post/:postId',
                views: {
                    'tab-feed': {
                        templateUrl: 'templates/tab-feed-question.html',
                        controller: 'FeedQuestionCtrl'
                    }
                }
            })
            .state('tab.feedEditProfile', {
                cache: false,
                url: '/feed/editProfile',
                views: {
                    'tab-feed': {
                        templateUrl: 'templates/tab-editProfile.html',
                        controller: 'EditProfileCtrl'
                    }
                }
            })
            .state('tab.feedProfile', {
                cache: false,
                url: '/feed/profile/:userId',
                views: {
                    'tab-feed': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('tab.notifications', {
                cache: false,
                url: '/notifications',
                views: {
                    'tab-notifications': {
                        templateUrl: 'templates/tab-notifications.html',
                        controller: 'NotificationsCtrl'
                    }
                }
            })
            .state('tab.notifications-profile', {
                cache: false,
                url: '/notifications/profile/:userId',
                views: {
                    'tab-notifications': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('tab.notifications-question', {
                cache: false,
                url: '/notifications/post/:postId',
                views: {
                    'tab-notifications': {
                        templateUrl: 'templates/tab-feed-question.html',
                        controller: 'FeedQuestionCtrl'
                    }
                }
            })

            .state('tab.explore', {
                url: '/explore',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/tab-explore.html',
                        controller: 'ExploreCtrl'
                    }
                }
            })
            .state('tab.profile', {
                cache: false,
                url: '/explore/profile/:userId',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('tab.editProfile', {
                cache: false,
                url: '/explore/editProfile',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/tab-editProfile.html',
                        controller: 'EditProfileCtrl'
                    }
                }
            })
            .state('tab.explore-question', {
                cache: false,
                url: '/explore/post/:postId',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/tab-feed-question.html',
                        controller: 'FeedQuestionCtrl'
                    }
                }
            })
            .state('tab.search', {
                cache: false,
                url: '/explore/search/:searchTerm',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })
            .state('tab.tips', {
                cache: false,
                url: '/explore/tips',
                views: {
                    'tab-explore': {
                        templateUrl: 'templates/tips.html'
                    }
                }
            })

            .state('tab.new', {
                cache: false,
                url: '/new',
                views: {
                    'tab-new': {
                        templateUrl: 'templates/tab-new.html',
                        controller: 'NewCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/splash');
    });
